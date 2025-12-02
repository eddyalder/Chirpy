import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";
import Loader from "./Loader";

export function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(data => {
        setRows(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="status-card">
          <Loader />
          <p className="status-text">Fetching top birds...</p>
        </div>
        <style>{`
          .leaderboard-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            width: 100%;
          }
          .status-card {
            background: rgba(255, 255, 255, 0.9);
            padding: 3rem;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .status-text {
            color: var(--color-text-light);
            font-weight: 600;
            font-size: 1.1rem;
          }
          @keyframes popIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="leaderboard">
        <h2>🏆 Top Birds</h2>
        <div className="empty-state">
          <div className="empty-icon">🗳️</div>
          <h3>No Votes Yet</h3>
          <p>Be the first to cast a vote and start the ranking!</p>
        </div>
        <style>{`
          .leaderboard {
            background: rgba(255, 255, 255, 0.95);
            padding: 3rem;
            border-radius: 24px;
            margin: 2rem auto;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            text-align: center;
            animation: slideUp 0.5s ease-out;
          }
          .leaderboard h2 {
            color: var(--color-primary);
            margin-bottom: 2rem;
            font-size: 2.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .empty-state {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: 0.5rem;
            animation: float 3s ease-in-out infinite;
          }
          .empty-state h3 {
            font-size: 1.5rem;
            color: var(--color-text);
            margin: 0;
          }
          .empty-state p {
            color: var(--color-text-light);
            font-size: 1.1rem;
            margin: 0;
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h2>🏆 Top Birds</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Bird</th>
              <th>Wins</th>
              <th>Losses</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <span className={`rank-badge rank-${index + 1}`}>
                    #{index + 1}
                  </span>
                </td>
                <td className="bird-name-cell">{row.slug}</td>
                <td className="stat-cell win">{row.wins}</td>
                <td className="stat-cell loss">{row.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .leaderboard {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 24px;
          margin: 2rem auto;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          animation: slideUp 0.5s ease-out;
        }
        .leaderboard h2 {
          text-align: center;
          color: var(--color-primary);
          margin-bottom: 2rem;
          font-size: 2.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          background: white;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 1.2rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }
        th {
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          background: #f9fafb;
        }
        td {
          color: #1f2937;
          font-weight: 500;
          font-size: 1.1rem;
        }
        .bird-name-cell {
          font-weight: 600;
          color: var(--color-text);
        }
        .stat-cell {
          font-variant-numeric: tabular-nums;
        }
        .stat-cell.win {
          color: var(--color-primary);
          font-weight: 700;
        }
        .stat-cell.loss {
          color: #ef4444;
        }
        .rank-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 700;
        }
        .rank-1 { background: #fef3c7; color: #d97706; }
        .rank-2 { background: #f3f4f6; color: #4b5563; }
        .rank-3 { background: #ffedd5; color: #c2410c; }
        
        tr:last-child td {
          border-bottom: none;
        }
        tr:hover td {
          background: #f9fafb;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
