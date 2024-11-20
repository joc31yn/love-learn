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
    force = requests.args.get('force', None)
    file = request.files['file']
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.auth.set_session(jwt, refresh)
    user_response = supabase.auth.get_user()
    user_id = json.loads(user_response.json())["user"]["id"]
    scraper = None
    events_data = []
    if tp == 'instagram':
        table_name = f'{tp}_{username}_events'
    else: 
        table_name = f'{tp}_events'
    if tp == 'instagram' and not force: 
        scraper = InstagramScraper(username=username, date=date).get_events()
    elif tp == 'instagram':
        scraper = InstagramScraper(username=username, date=date, force=True).get_events()
    elif tp == 'devpost':
        scraper = DevpostScraper().get_events()
    elif tp == 'learn':
        scraper = LearnScraper(URL=url).get_events()
    else:
        file.save('feed.ics')
        scraper = IcsScraper().get_events()
    #print("DONE")
    for event in events:
        events_data.append({
            "title": event["title"],
            "start_date": event["start_date"],
            "end_date": event["end_date"],
            "location": event["location"],
            "description": event["description"]
        })
    try:
        response = supabase.table(table_name).insert(events_data).execute()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # Remove duplicates if required
    unique_columns = ["user_id", "start_date", "end_date", "location", "description"]
    query = f"""
        SELECT id
        FROM (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY {', '.join(unique_columns)} ORDER BY id) AS rn
            FROM {table_name}
        ) subquery
        WHERE rn > 1
    """
    response = supabase.rpc("execute_sql", {"sql": query})
    if response.data:
        duplicate_ids = [row['id'] for row in response.data]
        if duplicate_ids:
            for duplicate_id in duplicate_ids:
                supabase.table(table_name).delete().eq("id", duplicate_id).execute()
            print(f"Removed {len(duplicate_ids)} duplicate rows.")
        else:
            print("No duplicates found.")
    else:
        print("Failed to identify duplicates.")
    return jsonify({"message": "Events scraped and added successfully", "duplicates": str(len(duplicate_ids))}), 200

@app.route("/")
def route():
    return "Juiced backend"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
