
import { useState, useEffect } from 'react';
import { getRandomBird } from './services/xenoCanto';
import { getBirdImage } from './services/imageService';
import { submitVote, pingServer } from './services/api';
import BirdCard from './components/BirdCard';
import Button from './components/Button';
import Loader from './components/Loader';
import BattleTransition from './components/BattleTransition';
import { Leaderboard } from './components/Leaderboard';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_XENO_CANTO_KEY || localStorage.getItem('xeno_canto_key') || '');
  // const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('xeno_canto_key'));
  const [showKeyInput, setShowKeyInput] = useState(false); // Default to false since we use env var

  // Wake up the server on load
  useEffect(() => {
    pingServer();
  }, []);

  // Battle State
  const [leftBird, setLeftBird] = useState(null);
  const [rightBird, setRightBird] = useState(null);
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'battle' | 'leaderboard'
  const [lastWinner, setLastWinner] = useState(null);
  const [playingSide, setPlayingSide] = useState(null); // 'left' | 'right' | null

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('xeno_canto_key', key);
    setShowKeyInput(false);
  };

  /*
  const clearKey = () => {
    setApiKey('');
    localStorage.removeItem('xeno_canto_key');
    setShowKeyInput(true);
    setView('home');
    setLeftBird(null);
    setRightBird(null);
    setPlayingSide(null);
  };
  */

  const fetchBirdData = async (key) => {
    try {
      const bird = await getRandomBird(key);
      let image = null;
      try {
        // Try scientific name first
        let rawImage = await getBirdImage(bird.sciName);

        // Fallback to common name if no image found
        if (!rawImage && bird.name) {
          console.log(`No image for ${bird.sciName}, trying common name: ${bird.name}`);
          rawImage = await getBirdImage(bird.name);
        }

        if (rawImage) {
          // Optimization: Background removal was too slow (30s+).
          // We will use the raw image and style it with CSS (circle crop).
          image = rawImage;
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
      // setShowKeyInput(true);
      setError("API Key missing. Please configure VITE_XENO_CANTO_KEY.");
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
      setView('battle');
      setLastWinner(null); // Reset winner after loading new pair
    } catch (err) {
      setError(err.message);
      if (err.message === 'API Key is required' || err.message.includes('key')) {
        // setShowKeyInput(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (winnerSide) => {
    const winner = winnerSide === 'left' ? leftBird : rightBird;
    const loser = winnerSide === 'left' ? rightBird : leftBird;

    setLastWinner(winner);
    setPlayingSide(null); // Stop audio on vote
    console.log(`Voted for ${winnerSide}`);

    // Submit vote to backend
    if (winner && loser) {
      // Use scientific name as slug for uniqueness, pass common name for display
      await submitVote(winner.sciName, loser.sciName, winner.name, loser.name);
    }

    startBattle(); // Load next round
  };

  // Loading Screen
  if (loading) {
    if (view === 'battle' && lastWinner) {
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
      {/* 
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
      */}

      {view === 'home' && (
        <div className="welcome-screen">
          <div className="hero-content">
            <div className="logo-badge">
              <img src="/favicon.svg" alt="Chirpy Logo" className="logo-img" />
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

            <div className="action-container" style={{ marginTop: '1rem' }}>
              <Button onClick={() => setView('leaderboard')} variant="secondary">
                View Leaderboard
              </Button>
            </div>

            {/*
            <div className="action-container">
              <button className="change-key-btn" onClick={() => setShowKeyInput(true)}>
                {apiKey ? 'Change API Key' : 'Enter API Key'}
              </button>
            </div>
            */}
          </div>

          <div className="decorative-birds">
            <span className="floating-bird b1">🦜</span>
            <span className="floating-bird b2">🦅</span>
            <span className="floating-bird b3">🦉</span>
          </div>
        </div>
      )}

      {view === 'battle' && (
        <div className="battle-arena">
          <div className="header">
            <h1>Chirpy</h1>
            <div className="header-actions">
              <button className="icon-btn" onClick={() => setView('leaderboard')} title="Leaderboard">
                🏆
              </button>
              <button className="exit-btn" onClick={() => setView('home')}>Exit</button>
            </div>
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

      {view === 'leaderboard' && (
        <div className="leaderboard-page">
          <div className="header">
            <h1>Leaderboard</h1>
            <button className="exit-btn" onClick={() => setView('home')}>Back</button>
          </div>
          <Leaderboard />
        </div>
      )}
      <Analytics />
    </div>
  );
}

export default App;

