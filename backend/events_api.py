import google.generativeai as genai
import os
import typing_extensions as typing
import PIL.Image
from flask import Flask, jsonify
import json
from dotenv import load_dotenv, dotenv_values


class Event(typing.TypedDict):
    event_name: str
    event_date: str
    event_time: str
    event_location: str
    event_description: str


directory = r"./photos/uwcsclub"
events = []
response = ""

load_dotenv()
API_KEY = os.getenv("GEM_API_KEY")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type":"application/json", "response_schema": Event})
for name in os.listdir(directory):
    if name.endswith(".jpg"):
        prompt = "If the image is a poster for an event, get information from the event in JSON format. No parentheses allowed. Otherwise if it is not an event, return all values as empty strings"
        response = response = model.generate_content([prompt, PIL.Image.open(directory + '\\' + name)])
        events.append(response.text)
print(events)

app = Flask(__name__)

@app.route('/api/events')
def get_events():
    return jsonify({'events': events})

@app.route('/')
def juice():
    return "juice"

if __name__ == '__main__':
    app.run()

