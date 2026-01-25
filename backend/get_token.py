from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

load_dotenv()

sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    scope="user-library-read"
)

print("\n--- CLICK THE LINK BELOW TO LOG IN ---")
print(sp_oauth.get_authorize_url())

url = input("\nPaste the URL you were redirected to here: ")

try:
    code = sp_oauth.parse_response_code(url)
    token_info = sp_oauth.get_access_token(code)
    print("\n------------------------------")
    print("COPY THIS TOKEN FOR YOUR REACT APP:")
    print(token_info['access_token'])
    print("------------------------------\n")
except Exception as e:
    print("Error getting token:", e)