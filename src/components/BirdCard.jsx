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
            <span style={{ fontSize: '4rem' }}>🐦</span>
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

        {/* Sound Selectors */}
        {bird.recordings && bird.recordings.length > 1 && (
          <div className="sound-selectors">
            {bird.recordings.map((_, index) => (
              <button
                key={index}
                className={`sound-dot ${index === currentRecordingIndex ? 'active' : ''}`}
                onClick={() => setCurrentRecordingIndex(index)}
                aria-label={`Select sound ${index + 1}`}
              />
            ))}
          </div>
        )}

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
          max-width: 400px;
          min-height: 580px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: visible;
          margin-top: 60px; /* Space for the bird popping out */
        }

        .battle-card {
            min-height: 500px; /* Slightly smaller for battle mode if needed */
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
          object-fit: contain;
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
          flex: 1;
        }

        .bird-name {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-text);
          line-height: 1.2;
          min-height: 2.4em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scientific-name {
          font-style: italic;
          color: var(--color-text-light);
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: var(--color-text-light);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          text-align: left;
          max-width: 100%;
          min-height: 2.7em;
        }

        .icon {
          margin-top: 4px;
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

        .sound-selectors {
            display: flex;
            gap: 8px;
            margin-bottom: 1.5rem;
        }

        .sound-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--color-secondary);
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .sound-dot.active {
            background: var(--color-primary);
            transform: scale(1.2);
        }

        .actions {
          margin-top: 2rem;
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 1rem;
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
