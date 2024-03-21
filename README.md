# Groova

Your personal AI playlist generator

## About Groova

Groova is a web application designed to curate personalized playlists for users based on their mood or given occasion. By integrating OpenAI API, Groova leverages the OpenAI LLM to understand and interpret user input to generate customized playlists! The app utilizes the Spotify API to seamlessly create and save playlists directly to users' Spotify profiles. Through the Spotify API, Groova personalizes user experience through listening history analysis.

![Alt text](/../screenshots/screenshots/ss1.png?raw=true "Groova login")
![Alt text](/../screenshots/screenshots/ss3.png?raw=true "Groova homepage")
![Alt text](/../screenshots/screenshots/ss4.png?raw=true "Groova playlist generated")

## Groova Full Run-Through

[<img src="/../screenshots/screenshots/thumbnail.png?raw=true" width="100%">](https://www.youtube.com/watch?v=JCzV5yYbKfQ "Groova full run-through")

## Getting Started
**Prerequisites**

Ensure that you have [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) and [Pip](https://pypi.org/project/pip/) installed

- [Yarn installation instructions](https://www.hostinger.com/tutorials/how-to-install-yarn)
- [Pip windows installation instructions](https://www.liquidweb.com/kb/install-pip-windows/)
- [Pip mac installation instructions](https://macpaw.com/how-to/install-pip-mac)

Create a Spotify for Developers account
- [Link to Spotify for Developers](https://developer.spotify.com/)

Navigate to your Spotify for Developers dashboard and create a new app
- add your corresponding redirect URI. For Mac users, add http://localhost:8000/api/redirect and for Windows users, add http://127.0.0.1:5000/api/redirect
- make sure to select the web API option

Once you've created the app, navigate to the app's settings page. there, you will find your client id and client secret information you will need later.

Create an OpenAI account
- [Link to OpenAI](https://openai.com/)

Navigate to the "API Keys" tab on the left hand side and create a new secret key.


## Run Locally

- clone Groova into your environment and go to the project directory

```bash
  git clone https://github.com/AmirahHarb/Groova.git
  cd Groova
```
- if you are running Groova on a Mac, proceed to the next step. Otherwise, if you are running Groova on Windows, switch to the 'main-windows' branch before proceeding to the next step.
```bash
  git checkout main-windows
```
**Setting up environment variables**

- At the root of the project, there is a file called ".env"
- inside the file, replace each variable with your own relevant information 
```bash
SPOTIPY_CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID_HERE"
SPOTIPY_CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET_HERE"
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"
``` 
- inside the file, add the redirect URI 
- for Windows:
```bash
SPOTIPY_REDIRECT_URI = "http://127.0.0.1:5000/api/redirect"
```
- for Mac:
```bash
SPOTIPY_REDIRECT_URI = "http://localhost:8000/api/redirect"
```
**Create a Virtual Environment for Backend**

- cd into the project's backend source folder
```bash
cd packages/backend/src
```
- create and activate virtual environment
- For Windows:

```bash
python -m venv venv
venv\Scripts\activate
```
- for Mac:
```bash
python3 -m venv venv
source venv/bin/activate
```

**Install Dependancies**

- cd into the frontend source directory and install dependancies
```bash
cd packages/frontend/react/src
yarn install
``` 
**Run the app**
- from the frontend source directory, run the application
```bash
yarn start
``` 

## Authors

- [@AmirahHarb](https://github.com/AmirahHarb)
- [@okayyjen](https://github.com/okayyjen)
