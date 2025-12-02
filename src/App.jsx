
import React, { useState } from 'react';
import { getRandomBird } from './services/xenoCanto';
import { getBirdImage } from './services/imageService';
import { removeImageBackground } from './services/backgroundRemoval';
import BirdCard from './components/BirdCard';
import Button from './components/Button';
import Loader from './components/Loader';
import BattleTransition from './components/BattleTransition';
import { Music, Sparkles, Key } from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('xeno_canto_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('xeno_canto_key'));

  // Battle State
  const [leftBird, setLeftBird] = useState(null);
  const [rightBird, setRightBird] = useState(null);
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastWinner, setLastWinner] = useState(null);
  const [playingSide, setPlayingSide] = useState(null); // 'left' | 'right' | null

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('xeno_canto_key', key);
    setShowKeyInput(false);
  };

  const clearKey = () => {
    setApiKey('');
    localStorage.removeItem('xeno_canto_key');
    setShowKeyInput(true);
    setGameStarted(false);
    setLeftBird(null);
    setRightBird(null);
    setPlayingSide(null);
  };

  const fetchBirdData = async (key) => {
    try {
      const bird = await getRandomBird(key);
      let image = null;
      try {
        const rawImage = await getBirdImage(bird.sciName);
        if (rawImage) {
          image = await removeImageBackground(rawImage);
        }
      } catch (imgError) {
        console.error("Image error:", imgError);
      }
      return { bird, image };
    } catch (err) {
      console.error("Bird fetch error:", err);
      throw err;
    }
  };

  const startBattle = async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    setError(null);
    setPlayingSide(null);
    // Don't clear birds immediately if we want to show a transition, 
    // but we do need to clear them eventually or just replace them.
    // For now, we keep them until new ones arrive or we use the transition screen.

    try {
      // Fetch two birds in parallel
      const [leftResult, rightResult] = await Promise.all([
        fetchBirdData(apiKey),
        fetchBirdData(apiKey)
      ]);

      setLeftBird(leftResult.bird);
      setLeftImage(leftResult.image);
      setRightBird(rightResult.bird);
      setRightImage(rightResult.image);
      setGameStarted(true);
      setLastWinner(null); // Reset winner after loading new pair
    } catch (err) {
      setError(err.message);
      if (err.message === 'API Key is required' || err.message.includes('key')) {
        setShowKeyInput(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (winnerSide) => {
    const winner = winnerSide === 'left' ? leftBird : rightBird;
    setLastWinner(winner);
    setPlayingSide(null); // Stop audio on vote
    console.log(`Voted for ${winnerSide}`);
    startBattle(); // Load next round
  };

  // Loading Screen
  if (loading) {
    if (gameStarted && lastWinner) {
      return <BattleTransition winner={lastWinner} />;
    }

    return (
      <div className="app-container">
        <div className="loading-container">
          <Loader />
          <p className="loading-text">Setting up the battle...</p>
        </div>
        <style>{`
          .app-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          .loading-text {
            color: var(--color-text-light);
            font-size: 1.2rem;
            font-weight: 600;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {showKeyInput && (
        <div className="key-modal">
          <div className="modal-content">
            <h2>Enter Xeno-Canto API Key</h2>
            <p>Get one at <a href="https://xeno-canto.org/developer/api" target="_blank" rel="noreferrer">xeno-canto.org</a></p>
            <input
              type="text"
              placeholder="API Key"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveKey(e.target.value);
              }}
            />
            <Button onClick={(e) => saveKey(e.target.previousSibling.value)}>Save</Button>
          </div>
        </div>
      )}

      {!gameStarted ? (
        <div className="welcome-screen">
          <div className="hero-content">
            <div className="logo-badge">
              <span className="logo-icon">🐦</span>
            </div>
            <h1 className="title">Chirpy</h1>
            <p className="subtitle">Listen. Vote. Discover.</p>
            <p className="description">Two birds enter, one bird leaves (with your vote). Which one sounds cooler?</p>

            {error && <div className="error-message">{error}</div>}

            <div className="action-container">
              <Button onClick={startBattle} size="large" className="start-btn-pulse">
                Start Battle
              </Button>
            </div>

            <div className="action-container">
              <button className="change-key-btn" onClick={() => setShowKeyInput(true)}>
                {apiKey ? 'Change API Key' : 'Enter API Key'}
              </button>
            </div>
          </div>

          <div className="decorative-birds">
            <span className="floating-bird b1">🦜</span>
            <span className="floating-bird b2">🦅</span>
            <span className="floating-bird b3">🦉</span>
          </div>
        </div>
      ) : (
        <div className="battle-arena">
          <div className="header">
            <h1>Chirpy</h1>
            <button className="exit-btn" onClick={() => setGameStarted(false)}>Exit</button>
          </div>

          <div className="battle-ground">
            <div className="bird-column">
              <BirdCard
                bird={leftBird}
                image={leftImage}
                onVote={() => handleVote('left')}
                loading={loading}
                isBattleMode={true}
                isActive={playingSide === 'left'}
                onPlay={() => setPlayingSide('left')}
              />
            </div>

            <div className="vs-badge">
              <span>VS</span>
            </div>

            <div className="bird-column">
              <BirdCard
                bird={rightBird}
                image={rightImage}
                onVote={() => handleVote('right')}
                loading={loading}
                isBattleMode={true}
                isActive={playingSide === 'right'}
                onPlay={() => setPlayingSide('right')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
