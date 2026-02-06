from flask import Flask, request, jsonify
from flask_cors import CORS
import spotipy
import os
from dotenv import load_dotenv

load_dotenv() 

app = Flask(__name__)
CORS(app) 


def get_search_query(text):
    text = text.lower()
    
    
    stop_words = [
        "i", "am", "im", "feel", "feeling", "want", "wanna", "need", 
        "recommend", "show", "play", "me", "some", "listening", "to", 
        "let's", "lets", "and", "the", "a", "is", "for", "music", "songs"
    ]
    
    
    words = text.split()
    
    
    keywords = [word for word in words if word not in stop_words]
    
   
    if len(keywords) > 0:
        clean_query = " ".join(keywords)
        return clean_query 
    else:
        return "global top 50"

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    mood = data.get('mood')
    user_token = data.get('token', '').strip()

    print(f"\n--- REQUEST: {mood} ---")

    
    search_query = get_search_query(mood)
    print(f"🔎 Extracted Keywords: '{search_query}'")

    try:
        sp = spotipy.Spotify(auth=user_token)
        
        
        results = sp.search(q=search_query, limit=10, type='track')
        
        songs = []
        if results['tracks']['items']:
            for track in results['tracks']['items']:
                songs.append({
                    "name": track['name'],
                    "artist": track['artists'][0]['name'],
                    "image": track['album']['images'][0]['url'],
                    "link": track['external_urls']['spotify']
                })
        
        print(f" Found {len(songs)} songs for query: {search_query}")
        return jsonify(songs)
        
    except Exception as e:
        print(f" Error: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)