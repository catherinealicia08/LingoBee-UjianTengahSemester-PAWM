import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import './LeaderboardPage.css';
import crown from '../assets/crown.png';

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const [leaderboardData] = useState([
    { 
      rank: 1, 
      name: 'Audy Minion R', 
      points: 140000, 
      avatar: 'https://i.pravatar.cc/150?img=33',
      isTop3: true 
    },
    { 
      rank: 2, 
      name: 'Kevin Mouse P', 
      points: 120000, 
      avatar: 'https://i.pravatar.cc/150?img=12',
      isTop3: true 
    },
    { 
      rank: 3, 
      name: 'Olafine Alicia N', 
      points: 119999, 
      avatar: 'https://i.pravatar.cc/150?img=45',
      isTop3: true 
    },
    { rank: 4, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=5' },
    { rank: 5, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=6' },
    { rank: 6, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=7' },
    { rank: 7, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=8' },
    { rank: 8, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=9' },
    { rank: 9, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=10' },
    { rank: 10, name: 'Thalita Eleanor Majesta', points: 110000, avatar: 'https://i.pravatar.cc/150?img=11' },
  ]);

  const top3 = leaderboardData.slice(0, 3);
  const restOfLeaderboard = leaderboardData.slice(3);

  return (
    <div className="leaderboard-root">
      <LeftSidebar activePage="leaderboard" />

      {/* Main Content */}
      <main className="leaderboard-content">
        {/* Header with Level Info */}
        <header className="top-header">
          <div className="level-info">
            <span className="streak">1 🔥</span>
            <span className="level">Lvl 10</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/homepage')} className="breadcrumb-link">Dashboard</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Leaderboard</span>
        </div>

        {/* Leaderboard Title */}
        <h1 className="leaderboard-title">Leaderboard</h1>

        {/* Top 3 Podium */}
        <div className="podium-container">
          {/* Rank 2 - Left */}
          <div className="podium-item rank-2">
            <div className="rank-number">2</div>
            <div className="podium-avatar-wrapper">
              <img src={top3[1].avatar} alt={top3[1].name} className="podium-avatar" />
            </div>
            <p className="podium-name">{top3[1].name}</p>
            <p className="podium-points">{top3[1].points.toLocaleString()}</p>
          </div>

          {/* Rank 1 - Center with Crown */}
          <div className="podium-item rank-1">
            <img src={crown} alt="Crown" className="crown-icon" />
            <div className="rank-number">1</div>
            <div className="podium-avatar-wrapper winner">
              <img src={top3[0].avatar} alt={top3[0].name} className="podium-avatar" />
            </div>
            <p className="podium-name">{top3[0].name}</p>
            <p className="podium-points">{top3[0].points.toLocaleString()}</p>
          </div>

          {/* Rank 3 - Right */}
          <div className="podium-item rank-3">
            <div className="rank-number">3</div>
            <div className="podium-avatar-wrapper">
              <img src={top3[2].avatar} alt={top3[2].name} className="podium-avatar" />
            </div>
            <p className="podium-name">{top3[2].name}</p>
            <p className="podium-points">{top3[2].points.toLocaleString()}</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-table-container">
          <div className="leaderboard-table-header">
            <div className="table-col-rank">Rank</div>
            <div className="table-col-nama">Nama</div>
            <div className="table-col-poin">Poin</div>
          </div>

          <div className="leaderboard-table-body">
            {restOfLeaderboard.map((player) => (
              <div key={player.rank} className="leaderboard-row">
                <div className="table-col-rank">
                  <span className="rank-badge">{player.rank}</span>
                </div>
                <div className="table-col-nama">
                  <img src={player.avatar} alt={player.name} className="player-avatar" />
                  <span>{player.name}</span>
                </div>
                <div className="table-col-poin">
                  <span className="points-text">{player.points.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}