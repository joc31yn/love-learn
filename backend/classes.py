import subprocess
from datetime import datetime
import sys
import instaloader
import os
import typing_extensions as typing
import PIL.Image
import json
from dotenv import load_dotenv, dotenv_values
import google.generativeai as genai
from dataclasses import dataclass

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

    def get_events(self, **kwargs):
        evs = self.scrape_page(**kwargs)
        ans = [self.parse_event(ev, **kwargs) for ev in evs if self.parse_event(ev, **kwargs) is not None]
        return ans

class InstagramScraper(AbstractDataSource):
    URL: str
    username: str
    ig: instaloader.Instaloader
    date: str

    def __init__(self, username, date=None):
        super().__init__("https://instagram.com")
        self.username = username
        self.ig = instaloader.Instaloader()
        self.date = date 

    def scrape_page(self, **kwargs):
        """
        Downloads Instagram posts from a user's profile.
        """
        
        since_str = kwargs.get('since', self.date)
        since = datetime.strptime(since_str, "%Y-%m-%d")
        ig_profile = instaloader.Profile.from_username(self.ig.context, self.username)
        """
        for post in ig_profile.get_posts():
            date = post.date
            if date >= since:
                if post.typename == 'GraphImage':
                    self.ig.download_post(post, target=ig_profile.username)
            else:
                break
        """
        genai.configure()
        directory = f"./{ig_profile.username}"
        events = []
        model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type":"application/json", "response_schema": Event})
        for name in os.listdir(directory):
            if name.endswith((".jpg", ".png", ".jpeg")):
                prompt = "The image provided is a poster for an event. Get information from the event in JSON format, making sure start date and end date are of form YYYY-MM-DD. No parentheses allowed. If only one date, set it equal to both start date and ewnd date. If it is not an event, return all values as empty strings."
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
                    start_date = datetime.strptime(data["start_date"], "%Y-%m-%d")
                    end_date = datetime.strptime(data["end_date"], "%Y-%m-%d")
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
            date_obj = datetime.strptime(date_str, '%B %d')
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
