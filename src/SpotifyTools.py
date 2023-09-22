from flask import url_for
import spotipy
import os
import re
import json

from dotenv import load_dotenv

load_dotenv()

clientID = os.getenv("SPOTIPY_CLIENT_ID")
clientSecret = os.getenv("SPOTIPY_CLIENT_SECRET")
redirectURI = os.getenv("SPOTIPY_REDIRECT_URI")

#do not have this as global variable. create new oauth object for each use
def create_spotify_oauth():

    scopes = ["user-top-read", "playlist-modify-private","playlist-modify-public"]

    return spotipy.oauth2.SpotifyOAuth(
            client_id=clientID,
            client_secret=clientSecret,
            redirect_uri=url_for('callback', _external=True),
            scope=' '.join(scopes))

#getter for current user's display name
def get_display_name(session):
    return session['user_info']['display_name']

#getter for current user's top 20 artists
def get_top_artists(token_info):
    sp = spotipy.Spotify(auth=token_info['access_token'])
    top_artists = sp.current_user_top_artists(time_range='medium_term', limit=5)

    # Extract artist names from the response
    artist_names = [artist['name'] for artist in top_artists['items']]

    for i, artist in enumerate(artist_names, start=1):
        print(f"{i}. {artist}")

    return top_artists

#creates empty playlist
def create_playlist(session, token_info):

    sp = spotipy.Spotify(auth=token_info['access_token'])
    user_id = session['user_info']['id']
    playlist = sp.user_playlist_create(user_id, "New Playlist", public=True,collaborative=False, description="")
    playlist_url = playlist['external_urls']['spotify']

    return playlist

#TODO figure out this function VVV, then create one to be passed to AI
#def add_track_to_playlist(playlist, track):

#getter for current user's top 20 tracks
def get_top_tracks(token_info):
    sp = spotipy.Spotify(auth=token_info['access_token'])
    top_tracks = sp.current_user_top_tracks(limit=3, offset=0)
    top_tracks_names = [track['name'] for track in top_tracks['items']]

    for i, track in enumerate(top_tracks_names, start=1):
        print(f"{i}. {track}")

    return top_tracks

def get_song_features(tracks, token_info):
    sp = spotipy.Spotify(auth=token_info['access_token'])

    tracks_id_list = []
    for track in tracks['items']:
        track_id = track['id']
        tracks_id_list.append(track_id)

    features = sp.audio_features(tracks_id_list)
    return features


def get_recommendations(token_info, top_artists, target_features) -> dict:
    sp = spotipy.Spotify(auth=token_info['access_token'])

    artist_URLs = []
    for artist in top_artists['items']:
        artist_url = artist['external_urls']['spotify']
        artist_URLs.append(artist_url)

    recommended_tracks = sp.recommendations(seed_artists=artist_URLs, limit=20, target_features=target_features)
    return recommended_tracks


def add_tracks(token_info,session,tracks):

    sp = spotipy.Spotify(auth=token_info['access_token'])
    track_uris = [track['uri'] for track in tracks['tracks']]

    #creating playlist and getting playlist_id
    playlist = create_playlist(session, token_info)
    playlist_id = playlist['id']
    sp.playlist_add_items(playlist_id, track_uris, position=None)

    return playlist['external_urls']['spotify']

def extract_and_format(response):
    features_pattern = r'(acousticness|danceability|tempo|valence|energy):?\s*(\d+(\.\d+)?)'
    genres_pattern = r"'genres':\s*'([^']+)'"
    features_match = re.findall(features_pattern, response)
    genres_match = re.search(genres_pattern, response)
        
    features_dict = {}
        
    for keyword, value, _ in features_match:
        features_dict[keyword] = {'target': float(value)}

    if genres_match:
        genres_data = genres_match.group(1).split(', ')
        genres_dict = {'genres': genres_data}
        
    return features_dict, genres_dict

def extract_genres_from_input(response):
    try:
        # Parse the input string as a JSON object
        input_dict = json.loads(response)

        # Extract the 'genres' field from the dictionary
        genres_str = input_dict.get('genres', '')

        # Split the 'genres' field by commas and strip whitespace to create a list of genres
        genres_list = [genre.strip() for genre in genres_str.split(',')]

        return genres_list
    except json.JSONDecodeError:
        # Handle parsing errors by returning an empty list
        return []