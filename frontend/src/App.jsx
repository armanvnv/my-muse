import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { FiHome, FiMusic, FiHeart, FiSettings, FiSearch, FiActivity } from "react-icons/fi";
import { RiNeteaseCloudMusicLine, RiSparklingFill, RiRobot2Line, RiCloseCircleLine } from "react-icons/ri";

function App() {
  
  const token = "YOUR TOKEN HERE";
  
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [status, setStatus] = useState("Enter your vibe above to get started.");
  

  const [currentSong, setCurrentSong] = useState(null);

  const handleSearch = async () => {
    if(!mood) return;
    
    setStatus("✨ Aura AI is curating your vibe...");
    setSongs([]);
    setCurrentSong(null);
    
    try {
      const res = await axios.post('http://127.0.0.1:5000/recommend', {
        mood: mood,
        token: token
      });
      setSongs(res.data);
      setStatus("Results for: " + mood);
    } catch (err) {
      console.error(err);
      setStatus("Error. Token expired or backend down.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  
  const playSong = (link) => {
    // Link format: https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
    // We need just the ID: 4uLU6hMCjMI75M1A2tKUQC
    const trackId = link.split("/").pop().split("?")[0];
    setCurrentSong(trackId);
  };

  return (
    <div className="dashboard">
      
      <aside className="sidebar">
        <div className="logo">
          <RiNeteaseCloudMusicLine size={28} /> 
          MyMuse
        </div>
        <ul className="nav-menu">
          <li className="nav-item"><FiHome className="nav-icon"/> Home</li>
          <li className="nav-item active" style={{color: '#00e1ff', background: 'rgba(0, 225, 255, 0.1)'}}>
            <RiSparklingFill className="nav-icon"/> 
            AI DJ
          </li>
          <li className="nav-item"><FiMusic className="nav-icon"/> Genres</li>
          <li className="nav-item"><FiHeart className="nav-icon"/> Favorites</li>
          <li className="nav-item"><FiActivity className="nav-icon"/> Recent</li>
          <div style={{marginTop: 'auto'}}></div> 
          <li className="nav-item"><FiSettings className="nav-icon"/> Settings</li>
        </ul>
      </aside>

      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-container">
            <RiRobot2Line className="search-icon" style={{color: '#00e1ff'}}/> 
            <input 
              type="text" 
              className="mood-input"
              placeholder="Ask AI: 'I need energy for the gym...'"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>
             <RiSparklingFill style={{marginRight: '5px'}}/> Ask Muse
          </button>
        </header>

        <section className="content-feed">
          <h2 className="section-title">{status}</h2>

          <div className="songs-grid">
            {songs.map((song, index) => (
              <div key={index} className="song-card" onClick={() => playSong(song.link)}>
                <img src={song.image} alt={song.name} className="card-image" />
                <h3 className="song-title">{song.name}</h3>
                <p className="song-artist">{song.artist}</p>
              </div>
            ))}
          </div>
        </section>

        
        {currentSong && (
          <div className="player-container">
             <button className="close-player" onClick={() => setCurrentSong(null)}>
               <RiCloseCircleLine />
             </button>
             <iframe 
               className="spotify-iframe"
               src={`https://open.spotify.com/embed/track/${currentSong}?utm_source=generator&theme=0`} 
               height="152" 
               frameBorder="0" 
               allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
               loading="lazy">
             </iframe>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;