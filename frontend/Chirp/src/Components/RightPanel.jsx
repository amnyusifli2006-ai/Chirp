import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import "./RightPanel.css";

function RightPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { id: 2, username: "alice", bio: "Designer & creator" },
      { id: 3, username: "bob", bio: "Full stack dev" },
      { id: 4, username: "sara", bio: "Coffee & code" },
    ]);
  }, []);

  return (
    <div className="right-panel">
      <div className="right-card">
        <h3 className="right-title">Who to follow</h3>
        {users.map((user) => (
          <div key={user.id} className="suggest-user">
            <div className="suggest-avatar">
              {user.username[0].toUpperCase()}
            </div>
            <div className="suggest-info">
              <span className="suggest-name">@{user.username}</span>
              <span className="suggest-bio">{user.bio}</span>
            </div>
            <button className="follow-btn">
              <FiUserPlus size={15} /> Follow
            </button>
          </div>
        ))}
      </div>

      <div className="right-card">
        <h3 className="right-title">Trending</h3>
        {["#React", "#CSharp", "#WebAPI", "#Chirp"].map((tag) => (
          <div key={tag} className="trend-item">
            <span className="trend-tag">{tag}</span>
            <span className="trend-count">
              {Math.floor(Math.random() * 5000)} chirps
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightPanel;
