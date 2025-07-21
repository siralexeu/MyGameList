import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/users`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
          setDisplayedUsers(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [API_URL]);

  useEffect(() => {
    if (!searchTerm) {
      setDisplayedUsers(users);
    } else {
      setDisplayedUsers(
        users.filter(u =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  return (
    <div className="users-container">
      <h2>All Users</h2>
      <div className="users-inner">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {displayedUsers.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No users found.</p>
        ) : (
          <div className="users-list">
            {displayedUsers.map(u => (
              <div
                key={u.id}
                className="user-card"
                onClick={() => navigate(`/users/${u.id}`)}
              >
                <div className="user-info">
                  <div className="avatar">
                    <span>{u.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="username">{u.username}</span>
                </div>
                <div className="badges">
                  <span className="badge playing">
                    Playing: {u.playingCount}
                  </span>
                  <span className="badge plan">
                    Plan to play: {u.planToPlayCount}
                  </span>
                  <span className="badge completed">
                    Completed: {u.completedCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;