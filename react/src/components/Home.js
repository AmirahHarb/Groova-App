import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../static/Home.scss';
import {createMessageElement} from './messageCreator';
import Shared from './Shared';
import Loading from './Loading';

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

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [userInput]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      //sending the user input, ask list, and playlist details to backend
      if(userInput){
        const response = await axios.post('/get_user_input', {
          user_input: userInput,
          ask_for: askFor,
          p_details: playlistDetails
        });
  
        setAskFor(response.data['updatedAskList']);
        setPlaylistDetails(response.data['updatedPlaylistDetails']);
        setAIResponse(response.data['AIResponse']);

        console.log(AIResponse)
  
        
        const messageElementUser = createMessageElement(userInput, "message-user");
        messageContainerRef.current.appendChild(messageElementUser);
        
        if(AIResponse){
          const messageElementAI= createMessageElement(AIResponse, "message-AI");
          messageContainerRef.current.appendChild(messageElementAI);
        }
        
        
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