
import React, { useState } from 'react';
import { getRandomBird } from './services/xenoCanto';
import { getBirdImage } from './services/imageService';
import { removeImageBackground } from './services/backgroundRemoval';
import BirdCard from './components/BirdCard';
import Button from './components/Button';
import Loader from './components/Loader';
import { Music, Sparkles, Key } from 'lucide-react';

function App() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bird, setBird] = useState(null);
  const [birdImage, setBirdImage] = useState(null);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('xeno_canto_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('xeno_canto_key'));

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('xeno_canto_key', key);
    setShowKeyInput(false);
  };

  const clearKey = () => {
    setApiKey('');
    localStorage.removeItem('xeno_canto_key');
    setShowKeyInput(true);
    setStarted(false);
    setBird(null);
  };

  const fetchBird = async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    setError(null);
    setBirdImage(null); // Reset image while loading

    try {
      // 1. Get Random Bird
      const birdData = await getRandomBird(apiKey);
      setBird(birdData);

      // 2. Get Image
      const imageUrl = await getBirdImage(birdData.sciName);

      if (imageUrl) {
        // 3. Remove Background
        // Note: This might take a moment
        const cutOutUrl = await removeImageBackground(imageUrl);
        setBirdImage(cutOutUrl);
      } else {
        setBirdImage(null); // Fallback will be shown in BirdCard
      }

    } catch (err) {
      console.error("Failed to fetch bird:", err);
      if (err.message.includes('Missing or invalid') || err.message.includes('403')) {
        setError("Invalid API Key. Please check your key.");
        setShowKeyInput(true);
      } else {
        setError("Oops! The bird flew away. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }
    setStarted(true);
    await fetchBird();
  };

  return (
    <div className="app-container">
      {!started ? (
        <div className="welcome-screen">
          <div className="logo-container">
            <Music size={48} className="logo-icon" />
            <Sparkles size={24} className="sparkle-icon" />
          </div>
          <h1 className="title">ReBird</h1>
          <p className="subtitle">Discover the songs of nature.</p>

          {showKeyInput ? (
            <div className="key-input-container">
              <p className="key-instruction">Please enter your Xeno-Canto API Key (v3)</p>
              <div className="input-wrapper">
                <Key size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Paste your API key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="api-input"
                />
              </div>
              <Button onClick={() => saveKey(apiKey)} disabled={!apiKey} className="save-key-button">
                Save & Start
              </Button>
              <p className="key-help">
                Get a key at <a href="https://xeno-canto.org/account" target="_blank" rel="noreferrer">xeno-canto.org</a>
              </p>
            </div>
          ) : (
            <div className="start-actions">
              <Button onClick={handleStart} className="start-button">
                Get a Bird
              </Button>
              <button onClick={clearKey} className="change-key-link">Change API Key</button>
            </div>
          )}
        </div>
      ) : (
        <div className="main-screen">
          {loading && !bird ? (
            <div className="loading-container">
              <Loader />
              <p>Catching a bird...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <Button onClick={fetchBird}>Try Again</Button>
              <button onClick={clearKey} className="change-key-link" style={{ marginTop: '1rem' }}>Change API Key</button>
            </div>
          ) : (
            <BirdCard
              bird={bird}
              image={birdImage}
              onRandomize={fetchBird}
              loading={loading}
            />
          )}
        </div>
      )}

      <style>{`
        .app-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
        }

        .welcome-screen {
          text-align: center;
          animation: fadeIn 0.8s ease-out;
          width: 100%;
          max-width: 400px;
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }

        .sparkle-icon {
          position: absolute;
          top: -10px;
          right: -10px;
          color: var(--color-secondary);
          animation: pulse 2s infinite;
        }

        .title {
          font-size: 4rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 0.5rem;
          letter-spacing: -0.05em;
        }

        .subtitle {
          font-size: 1.25rem;
          color: var(--color-text-light);
          margin-bottom: 3rem;
        }

        .key-input-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: white;
          padding: 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-soft);
        }

        .key-instruction {
          font-size: 0.9rem;
          color: var(--color-text-light);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
        }

        .api-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 2px solid #e5e7eb;
          border-radius: var(--radius-md);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .api-input:focus {
          border-color: var(--color-primary);
        }

        .key-help {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .key-help a {
          color: var(--color-primary);
          text-decoration: none;
        }

        .start-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .change-key-link {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 0.9rem;
          text-decoration: underline;
          cursor: pointer;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--color-text-light);
        }

        .error-container {
          text-align: center;
          color: #ef4444;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default App;
