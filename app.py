# app.py 

from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import os
import requests
from bs4 import BeautifulSoup
import json

app = Flask(__name__)
CORS(app)

# Load level configurations
with open('level_config.json', 'r') as f:
    level_config = json.load(f)

# Function to extract text from an image using EasyOCR
def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en'], gpu=True)
    try:
        results = reader.readtext(image_path, detail=0)
        full_text = " ".join(results)
        return full_text
    except Exception as e:
        print(f"Error during text extraction: {e}")
        return ""

# Function to check for the presence of words in the extracted text
def check_words_in_text(text, words_to_check):
    results = {}
    for word, variations in words_to_check.items():
        results[word] = any(variation in text for variation in variations)
    return results

# Function to scrape and extract text from a webpage
def scrape_webpage(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            page_text = soup.get_text(separator=' ', strip=True)
            return ' '.join(page_text.split())
        else:
            return None
    except Exception as e:
        print(f"Error during scraping: {e}")
        return None

# Flask route to accept image and URL input and analyze
@app.route('/analyze', methods=['POST'])
def analyze():
    level = request.form.get('level')
    if not level or level not in level_config:
        return jsonify({"error": "Invalid level provided"}), 400

    data = request.form
    image_file = request.files.get('image')
    url = data.get('url')
    
    config = level_config[level]
    search_text = config['search_text']
    equivalent_phrases = config['equivalent_phrases']

    response_data = {}

    if image_file:
        # Save the uploaded image temporarily
        image_path = 'temp_image.jpg'
        image_file.save(image_path)

        # Extract text from the image
        full_text = extract_text_from_image(image_path)

        # Check if the words are present in the extracted text using equivalent phrases
        presence_results = check_words_in_text(full_text, equivalent_phrases)
        word_check_message_image = "Congratulations, you found the information!" if all(presence_results.values()) else "Information is incorrect or missing."

        # Clean up the temporary image file
        if os.path.exists(image_path):
            os.remove(image_path)

        response_data['word_check_message_image'] = word_check_message_image
        response_data['extracted_text'] = full_text
        response_data['presence_results'] = presence_results

    if url:
        page_text = scrape_webpage(url)
        if page_text:
            presence_results = check_words_in_text(page_text, equivalent_phrases)
            word_check_message_url = "Information verified" if all(presence_results.values()) else "Sorry, we can't verify it from the provided URL."

            response_data['word_check_message_url'] = word_check_message_url
            response_data['presence_results_url'] = presence_results
        else:
            response_data['error_url'] = "Failed to retrieve the webpage"

    if not image_file and not url:
        return jsonify({"error": "No image or URL provided"}), 400

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
