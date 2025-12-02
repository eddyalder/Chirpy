import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";

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

    if (loading) return <div className="leaderboard-loading">Loading leaderboard...</div>;
    if (rows.length === 0) return null;

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
                                <td>#{index + 1}</td>
                                <td>{row.slug}</td>
                                <td>{row.wins}</td>
                                <td>{row.losses}</td>
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
          margin: 4rem auto;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }
        .leaderboard h2 {
          text-align: center;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
          font-size: 2rem;
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        th {
          font-weight: 700;
          color: #4b5563;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
        td {
          color: #1f2937;
          font-weight: 500;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .leaderboard-loading {
            text-align: center;
            padding: 2rem;
            color: white;
            font-weight: 500;
        }
      `}</style>
        </div>
    );
}
