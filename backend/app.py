from flask import Flask, jsonify
import 

app = Flask(__name__)

@app.route('/')
def hello():
    return "Juiced backend!"
