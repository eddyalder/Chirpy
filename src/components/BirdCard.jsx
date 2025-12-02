import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, MapPin, Music } from 'lucide-react';
import Button from './Button';

const BirdCard = ({ bird, image, onRandomize, onVote, loading, isBattleMode, isActive, onPlay }) => {
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Reset state when bird changes
  useEffect(() => {
    setCurrentRecordingIndex(0);
    setIsPlaying(false);
  }, [bird]);

  // Handle audio source change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.load();
    }
  }, [currentRecordingIndex, bird]);

  // Handle external stop (when another bird starts playing)
  useEffect(() => {
    if (isBattleMode && !isActive && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isBattleMode, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // If battle mode, notify parent we are playing
        if (isBattleMode && onPlay) {
          onPlay();
        }
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (!bird) return null;

  const currentRecording = bird.recordings && bird.recordings[currentRecordingIndex]
    ? bird.recordings[currentRecordingIndex]
    : { audio: bird.audio, location: bird.location, country: bird.country }; // Fallback

  return (
    <div className={`bird-card ${isBattleMode ? 'battle-card' : ''}`}>
      <div className="image-container">
        {image ? (
          <img src={image} alt={bird.name} className="bird-image" />
        ) : (
          <div className="placeholder-image">
            <img src="/favicon.svg" alt="Default Bird" className="default-bird-icon" />
          </div>
        )}
      </div>

      <div className="content">
        <h2 className="bird-name">{bird.name}</h2>
        <p className="scientific-name">{bird.sciName}</p>

        <div className="info-row">
          <MapPin size={16} className="icon" />
          <span>{currentRecording.location}, {currentRecording.country}</span>
        </div>

        <div className="controls">
          <button className="play-button" onClick={togglePlay}>
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          <div className="audio-visualizer">
            <div className={`bar ${isPlaying ? 'animate' : ''}`}></div>
            <div className={`bar ${isPlaying ? 'animate' : ''}`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`bar ${isPlaying ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`bar ${isPlaying ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>

        {/* Sound Selectors - Always render container to preserve space */}
        <div className="sound-selector-container">
          {bird.recordings && bird.recordings.length > 1 ? (
            <>
              <span className="sound-label">Variations:</span>
              <div className="sound-selectors">
                {bird.recordings.map((_, index) => (
                  <button
                    key={index}
                    className={`sound-btn ${index === currentRecordingIndex ? 'active' : ''}`}
                    onClick={() => setCurrentRecordingIndex(index)}
                    aria-label={`Select sound ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Invisible spacer to keep height consistent */
            <div style={{ height: '32px', visibility: 'hidden' }}></div>
          )}
        </div>

        <audio
          ref={audioRef}
          src={currentRecording.audio}
          onEnded={handleAudioEnded}
          onError={(e) => console.error("Audio error:", e)}
        />

        <div className="actions">
          {isBattleMode ? (
            <Button onClick={onVote} disabled={loading} variant="primary" className="vote-button">
              {loading ? 'Loading...' : 'Vote for Me!'}
            </Button>
          ) : (
            <Button onClick={onRandomize} disabled={loading} variant="secondary">
              <RefreshCw size={20} className={loading ? 'spin' : ''} />
              {loading ? 'Finding Bird...' : 'Another Bird'}
            </Button>
          )}
        </div>
      </div>

      <style>{`
        .bird-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 2rem;
          width: 100%;
          /* Removed fixed min-height and height:100% to let content dictate size */
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: visible;
          margin-top: 60px;
        }

        .battle-card {
            /* No extra styles needed */
        }

        .image-container {
          width: 200px;
          height: 200px;
          margin-top: -120px;
          margin-bottom: 1rem;
          position: relative;
          z-index: 10;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        
        .bird-card:hover .image-container {
          transform: scale(1.05) translateY(-5px);
        }

        .bird-image {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensure image fills the circle */
          border-radius: 50%; /* Make it a circle */
          border: 4px solid white; /* Add a nice border */
          box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Add depth */
          background-color: #f0fdf4; /* Fallback background */
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0f2f1;
          border-radius: 50%;
        }

        .content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          /* Removed flex: 1 to prevent stretching */
        }

        .bird-name {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-text);
          line-height: 1.2;
          height: 2.4em; /* Fixed height for 2 lines */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 0.25rem;
        }

        .scientific-name {
          font-style: italic;
          color: var(--color-text-light);
          opacity: 0.8;
          margin-bottom: 0.5rem;
          height: 1.5em; /* Fixed height for 1 line */
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100%;
          max-width: 300px;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: var(--color-text-light);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          text-align: left;
          width: 100%;
          /* Strictly enforce height for 2 lines of text */
          line-height: 1.5;
          height: 3em; /* 1.5 * 2 lines = 3em */
          overflow: hidden;
          flex-shrink: 0; /* Prevent shrinking */
        }

        .info-row span {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .icon {
          margin-top: 0.25em; /* Align with first line of text */
          flex-shrink: 0;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          margin-bottom: 1rem;
          width: 100%;
          justify-content: center;
        }

        .play-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .play-button:hover {
          transform: scale(1.1);
          background: var(--color-primary-hover);
        }

        .audio-visualizer {
          display: flex;
          gap: 4px;
          height: 24px;
          align-items: center;
        }

        .bar {
          width: 4px;
          height: 4px;
          background: var(--color-primary);
          border-radius: 2px;
          transition: height 0.1s ease;
        }

        .bar.animate {
          animation: visualize 0.5s infinite alternate;
        }

        @keyframes visualize {
          0% { height: 4px; }
          100% { height: 24px; }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .sound-selector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem; /* Reduced margin */
          min-height: 60px; /* Reserve space even if empty/hidden to prevent jumping */
          justify-content: center;
        }
        
        /* Hide container if empty but keep layout stable if we want strict alignment, 
           but since it's conditional in JSX, we need to handle the case where it's NOT rendered.
           Actually, better to ALWAYS render it but make it invisible if no variations.
        */

        .sound-label {
          font-size: 0.8rem;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .sound-selectors {
            display: flex;
            gap: 8px;
        }

        .sound-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            border: 2px solid transparent;
            color: var(--color-text-light);
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sound-btn:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: translateY(-2px);
        }

        .sound-btn.active {
            background: var(--color-primary);
            color: white;
            box-shadow: 0 4px 10px rgba(74, 222, 128, 0.3);
            transform: scale(1.1);
        }

        .actions {
          /* Removed margin-top: auto to reduce space */
          margin-top: 1rem;
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 0;
        }
        
        .vote-button {
            width: 100%;
            font-size: 1.2rem;
            padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default BirdCard;
