
import React from 'react';
import Loader from './Loader';

const BattleTransition = ({ winner }) => {
    return (
        <div className="transition-container">
            <div className="winner-showcase">
                <div className="winner-icon">🎉</div>
                <h2>Good Choice!</h2>
                {winner && (
                    <div className="winner-card">
                        <p className="winner-name">{winner.name}</p>
                        <p className="winner-sci">{winner.sciName}</p>
                    </div>
                )}
            </div>

            <div className="next-battle-loader">
                <Loader />
                <p>Scouting for new challengers...</p>
            </div>

            <style>{`
        .transition-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80vh;
          gap: 3rem;
          animation: fadeIn 0.5s ease-out;
          text-align: center;
        }

        .winner-showcase {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .winner-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .winner-card {
          background: rgba(255, 255, 255, 0.8);
          padding: 1.5rem 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }

        .winner-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text);
        }

        .winner-sci {
          font-style: italic;
          color: var(--color-text-light);
        }

        .next-battle-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--color-text-light);
          opacity: 0;
          animation: fadeIn 0.5s ease-out 0.5s forwards; /* Delay appearance */
        }

        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default BattleTransition;
