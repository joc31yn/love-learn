import subprocess
import sys
import instaloader
import os
import typing_extensions as typing
import PIL.Image
import json
from dotenv import load_dotenv, dotenv_values
import google.generativeai as genai
from dataclasses import dataclass
import icalendar
from pathlib import Path
import pytz
import requests
import datetime

load_dotenv()

class Event(typing.TypedDict):
    """
    Make sure start_date and end_date are in the form YYYY-MM-DD
    """
    title: str
    start_date: str
    end_date: str
    location: str
    description: str

# Dataclass decorator for class validation
@dataclass
class ParsedEvent:
    title: str
    start_date: datetime # Data validation hook
    end_date: datetime
    location: str
    description: str

class AbstractDataSource:
    URL: str

    def __init__(self, URL):
        self.URL = URL

    def scrape_page(self, **kwargs):
        raise NotImplementedError

    def parse_event(self, ev, **kwargs):
        raise NotImplementedError
    
    def delete_feed(self):
        if os.path.isfile("./feed.ics"):
            os.remove("./feed.ics")

    def get_events(self, **kwargs):
        evs = self.scrape_page(**kwargs)
        ans = [self.parse_event(ev, **kwargs) for ev in evs if self.parse_event(ev, **kwargs) is not None]
        self.delete_feed()
        return ans


class InstagramScraper(AbstractDataSource):
    URL: str
    username: str
    force: str

    def __init__(self, username, date=None, force=False):
        super().__init__("https://instagram.com")
        self.username = username
        self.force = force

    def scrape_page(self, **kwargs):
        """
        Downloads Instagram posts from a user's profile.
        """
        if force: 
            payload = {
                "target": "instagram_graphql_user_posts",
                "username": "uwcsclub",
                "count": 12
            }
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": f"Basic {os.getenv('BEARER')}"
            }
            response = requests.post(url, json=payload, headers=headers)
            js = json.loads(response.text)
            with open('results.txt', 'wb') as f:
                f.write(response.text)
        else:
            js = json.loads('results.txt') # Get cached result if time not too far apart
        edges = js["results"][0]['content']['data']['user']['edge_owner_to_timeline_media']['edges']
        display_urls = [edge['node']['display_url'] for edge in edges]
        directory = f'./{self.username}'
        os.makedirs(directory, exist_ok=True)
        for i, url in enumerate(display_urls):
            try:
                response = requests.get(url, stream=True) 
                response.raise_for_status() 
                file_name = os.path.join(output_folder, f"image_{i+1}.jpg") 
                with open(file_name, 'wb') as file:
                    for chunk in response.iter_content(chunk_size=8192): 
                        file.write(chunk)
                print(f"Downloaded: {file_name}")
            except requests.exceptions.RequestException as e:
                print(f"Failed to download {url}: {e}")
        genai.configure()
        events = []
        model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type":"application/json", "response_schema": Event})
        for name in os.listdir(directory):
            if name.endswith((".jpg", ".png", ".jpeg")):
                prompt = "The image provided is a poster for an event. Get information from the event in JSON format, making sure start date and end date are of form YYYY-MM-DD. No parentheses allowed. If only one date, set it equal to both start date and end date. If it is not an event, return all values as empty strings."
                response = model.generate_content([prompt, PIL.Image.open(directory + '/' + name)])
                text = response.text
                #print(text)
                data = {}
                # JSON text sanity check here
                try: 
                    data = json.loads(text)
                except json.JSONDecodeError:
                    # If JSON parsing fails, repair the JSON
                        repaired_text = repair_json(text)
                        data = json.loads(repaired_text)
                try:
                    if data["end_date"] == "":
                        data["end_date"] = data["start_date"]
                    elif data["start_date"] == "":
                        data["start_date"] = data["end_date"]
                    start_date = datetime.datetime.strptime(data["start_date"], "%Y-%m-%d")
                    end_date = datetime.datetime.strptime(data["end_date"], "%Y-%m-%d")
                except (ValueError, TypeError):
                    # If date validation fails, set start_date and end_date to empty strings
                    data["start_date"] = ""
                    data["end_date"] = ""
                print(data)
                events.append(data)
        return events

    def parse_date(self, date_str):
        """
        Helper function to parse date strings to 'YYYY-MM-DD' format.
        """
        if not date_str:
            return ""
        try:
            date_obj = datetime.datetime.strptime(date_str, '%B %d')
            return date_obj.strftime('%Y-%m-%d')
        except ValueError:
            return ""  # Return empty if failed to parse

    def parse_event(self, ev, **kwargs):
        """
        Parses a post to extract event information.
        """
        event = {
            "title": ev["title"],
            "start_date": ev["start_date"],
            "end_date": ev["end_date"],
            "location": ev["location"],
            "description": ev["description"]
        }
        if (ev["start_date"] == "" or ev["end_date"] == ""):
            return None
        return event

class IcsScraper(AbstractDataSource):
    URL: str

    def __init__(self):
        super().__init__("./feed.ics")

    def time_zone_shift(self, time):
        """
        Shifts time based on whether the date is in daylight saving time (1 hour shift difference)
        """
        timezone = pytz.UTC
        nov_bound = datetime.datetime(datetime.datetime.now().year, 11, 1)
        nov_bound = timezone.localize(nov_bound + datetime.timedelta(days=(6-nov_bound.weekday())))

        march_bound = datetime.datetime(datetime.datetime.now().year, 3, 1)
        march_bound = timezone.localize(march_bound + datetime.timedelta(days=(6-march_bound.weekday() + 7)))

        if time >= march_bound and time < nov_bound:
            return time + datetime.timedelta(hours=-4)

        return time + datetime.timedelta(hours=-5)
    
    def scrape_page(self, **kwargs):
        ics_path = Path(self.URL)
        with ics_path.open() as e:
            calendar = icalendar.Calendar.from_ical(e.read())
        events = []
        data = {}
        for event in calendar.walk('VEVENT'):
            # if description doesnt exist, let it be an empty string
            if event.get("SUMMARY") is None:
                data["title"] = ""
            else:
                data["title"] = str(event.get("SUMMARY"))

            if event.get("DTSTART") is None:
                data["start_date"] = ""
            else:
                data["start_date"] = (self.time_zone_shift(event.get("DTSTART").dt)).strftime("%Y-%m-%d %H:%M")
            
            if event.get("DTEND") is None:
                data["end_date"] = ""
            else:
                data["end_date"] = (self.time_zone_shift(event.get("DTEND").dt)).strftime("%Y-%m-%d %H:%M")
            
            if event.get("LOCATION") is None:
                data["location"] = ""
            else:
                data["location"] = event.get("LOCATION")

            if event.get("DESCRIPTION") is None:
                data["description"] = ""
            else:
                data["description"] = event.get("DESCRIPTION")
            events.append(data)
            data = {}
        return events
    
    def parse_event(self, ev, **kwargs):
        return ev
    

class LearnScraper(IcsScraper):
    URL: str

    def __init__(self, URL):
        super().__init__(URL)

    def download_ics_file(self, url, path):
        """
        Download an .ics file from a given URL and save it locally.
        """
        # Send a GET request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Open the file and write the content
            with open(path, 'wb') as file:
                file.write(response.content)
        else:
            print(f"Failed to download the file. Status code: {response.status_code}")

    def scrape_page(self, **kwargs):    
        self.download_ics_file(self.URL, "./feed.ics")
        return super().scrape_page(**kwargs)

    def parse_event(self, ev, **kwargs):
        return super().parse_event(ev, **kwargs)

class DevpostScraper(AbstractDataSource):
    def __init__(self):
        URL = "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open"
        super().__init__(URL)

    def scrape_page(self, **kwargs):
        evs = []
        total = 1; cur = 0; i = 0
        while cur < total:
            r = requests.get(self.URL + (f"&page={i}" if i > 1 else ""))
            res = r.json()
            evs += res["hackathons"]
            total = res["meta"]["total_count"]
            cur += res["meta"]["per_page"]
        return evs

    def parse_event(self, ev, **kwargs):
        dates = ev["submission_period_dates"].split("-")
        startdate = dates[0].strip()
        enddate = dates[1].strip()
        startdate += enddate[-6:]
        try:
            startdate = datetime.datetime.strptime(startdate, "%b %d, %Y").strftime("%Y-%m-%d")
            enddate = datetime.datetime.strptime(enddate, "%b %d, %Y").strftime("%Y-%m-%d")
        except ValueError as e:
            print(f"Error parsing dates: {e}")
            return None
        return {
            "title": ev["title"],
            "startdate": startdate,
            "enddate": enddate,
            "locatioyn": ev["displayed_location"]["location"],
            "description": "",
        }

#if __name__ == "__main__":
    #print(InstagramScraper(username="uwcsclub", date="2024-11-17").get_events())
    #print(LearnScraper(URL="https://learn.uwaterloo.ca/d2l/le/calendar/feed/user/feed.ics?feedOU=1051763&token=a24z4c5slufphp3s3df84").get_events())
    #print(DevpostScraper().get_events())
    #print(IcsScraper().get_events())
