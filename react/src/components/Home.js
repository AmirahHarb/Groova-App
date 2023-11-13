import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import '../static/Home.scss';
import {createMessageElement} from './messageCreator';
import Shared from './Shared';
import Loading from './Loading';
import Elipses from './Elipses';

function Home() {
  const [displayName, setDisplayName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [askFor, setAskFor] = useState(['playlist_name', 'artist_name', 'user_mood_occasion']);
  const [playlistDetails, setPlaylistDetails] = useState({
        playlistName:"",
        artistName:"",
        userMoodOccasion:""});
  const [AIResponse, setAIResponse] = useState(null);
  const messageContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(true);
  const [playlistUrl, setPlaylistUrl] = useState('');
  
  const regex = /.*[a-zA-Z]+.*/;

  useEffect(() => {
    axios
      .get('/get_display_name')
      .then((response) => {
        setDisplayName(response.data);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error: ', error);
        setLoading(false);
      });
  }, []);

  useLayoutEffect(() => {
    if (!loading && messageContainerRef.current) {

      console.log(messageContainerRef)

      axios
      .get('/get_initial_interaction')
      .then((response) => {

        setAIResponse(response.data['initialQuestion']);

        const messageElementAI= createMessageElement(response.data['greetingMessage'], "message-AI");
        messageContainerRef.current.appendChild(messageElementAI);

        const questionAI= createMessageElement(response.data['initialQuestion'], "message-AI");
        messageContainerRef.current.appendChild(questionAI);

        setTyping(false);

      })
      .catch((error) => {
        console.error('Error: ', error);
        setTyping(false);
      });

    }
  }, [loading]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [userInput]);

  function generatePlaylist(currPlaylistDetails){
    console.log("call for generate")

    axios.post('/generate_playlist', {
      playlist_details: currPlaylistDetails
    }).then((response) => {
      
      const PURL = response.data['playlistUrl']
      const messageElementAI= createMessageElement(PURL, "message-AI");
      messageContainerRef.current.appendChild(messageElementAI);
    })
  
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //sending the user input, ask list, and playlist details to backend
      if(userInput && regex.test(userInput)){
        await axios.post('/get_user_input', {
          user_input: userInput,
          ask_for: askFor,
          p_details: playlistDetails,
          ai_response: AIResponse
        }).then((response) => {
          console.log(response);

          setAskFor(response.data['updatedAskList']);
          setPlaylistDetails(response.data['updatedPlaylistDetails']);
          setAIResponse(response.data['AIResponse']);

          const currAskfor = response.data['updatedAskList'];
          const currPlaylistDetails = response.data['updatedPlaylistDetails'];

          console.log("playlist deets inside: ", playlistDetails);
          console.log("ask list inside: ", askFor);
        
          
          const messageElementUser = createMessageElement(userInput, "message-user");
          messageContainerRef.current.appendChild(messageElementUser);

          const messageElementAI= createMessageElement(response.data['AIResponse'], "message-AI");
          messageContainerRef.current.appendChild(messageElementAI);
          

          if(currAskfor.length == 0 && currPlaylistDetails["userMoodOccasion"] != null){
            console.log("IN GENERATE IF STMNT: ", currPlaylistDetails)
            generatePlaylist(currPlaylistDetails);
          }

        });
        
        
  
        //resetting user input in prep for next submit 
        setUserInput('');
      }
      
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  return (
    <div className="App">
      <Shared></Shared>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="text-container">
            <header>
              <h1 className="home-greeting">Welcome {displayName}</h1>
            </header>
            <div className="chat-top-bar">
              <div id="text">Groova</div>
            </div>
            <div className="chat-box">
              <div className="message-cont" ref={messageContainerRef}></div>
              <div className = "elipses">{<Elipses typing={typing}/>} </div>
              <div ref={lastMessageRef}></div>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
              <input
                placeholder="Aa"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="input-bar"
              />
              <button type="submit" className="submit-button">
                <img id="send-icon" src={require('../images/send_icon_groova.png')} alt="spotify logo" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Home;