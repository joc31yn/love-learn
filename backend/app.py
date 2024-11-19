from flask import Flask, request, jsonify
from supabase import create_client, Client
from datetime import datetime
import os
from classes import InstagramScraper
from dotenv import load_dotenv, dotenv_values
import json

load_dotenv()

app = Flask(__name__)

# Load environment variables and set up Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

@app.route('/scrape_events', methods=['GET', 'POST'])
def scrape_events():
    username = request.args.get('username', None)
    date = request.args.get('date', None) # Expected format: "YYYY-MM-DD"
    url = request.args.get('url', None)
    jwt = request.args.get('jwt')
    refresh = request.args.get('refresh')
    tp = request.args.get('type')
    file = request.files['file']
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.set_session(jwt, refresh)
    user_response = supabase.auth.get_user()
    user_id = json.loads(user_response.json())["user"]["id"]
    scraper = None
    if tp == 'instagram':
        scraper = InstagramScraper(username=username, date=date).get_events()
    elif tp == 'devpost':
        scraper = DevpostScraper().get_events()
    elif tp == 'learn':
        scraper = LearnScraper(URL=url).get_events()
    else:
        file.save('feed.ics')
        scraper = IcsScraper().get_events()
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"message": "Events scraped and added successfully"}), 200

@app.route("/")
def route():
    return "Juiced backend"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
