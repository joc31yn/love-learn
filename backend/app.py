from flask import Flask, request, jsonify
from supabase import create_client, Client
from datetime import datetime
import os
from classes import InstagramScraper
from dotenv import load_dotenv, dotenv_values

load_dotenv()

app = Flask(__name__)

# Load environment variables and set up Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

@app.route('/scrape_events', methods=['GET', 'POST'])
def scrape_events():
    id = request.args.get('id')
    username = request.args.get('username')
    date = request.args.get('date')  # Expected format: "YYYY-MM-DD"
    if not username:
        return jsonify({"error": "Username is required"}), 500

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.set_access_token(jwt_token)
    user_response = supabase_client.auth.get_user()
    if not user_response or "id" not in user_response:
        return jsonify({"error": "Failed to retrieve authenticated user"}), 401
    user_id = user_response["id"]

    scraper = InstagramScraper(username=username, date=date)
    events = scraper.get_events()
    #print("DONE")
    events_data = []
    for event in events:
        events_data.append({
            "user_id": user_id,
            "title": event["title"],
            "start_date": event["start_date"],
            "end_date": event["end_date"],
            "location": event["location"],
            "description": event["description"]
        })

    try:
        response = supabase.table("user_events").insert(events_data).execute()
        if response.error:
            return jsonify({"error": response.error.message}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Events scraped and added successfully"}), 200

@app.route("/")
def route():
    return "Juiced backend"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
