
import React from 'react';

const Loader = () => {
    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '2rem' }}>
            <div className="dot" style={{ animationDelay: '0s' }}></div>
            <div className="dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="dot" style={{ animationDelay: '0.4s' }}></div>
            <style>{`
        .dot {
          width: 16px;
          height: 16px;
          background-color: var(--color-primary);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
