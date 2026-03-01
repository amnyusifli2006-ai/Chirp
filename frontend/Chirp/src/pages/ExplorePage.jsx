import { useState, useEffect } from "react";
import { FiSearch, FiUserPlus, FiUserCheck } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import RightPanel from "../Components/RightPanel";
import { useAuth } from "../context/AuthContext";
import "./ExplorePage.css";

function ExplorePage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5283/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchFollowing = async () => {
    if (!user) return;
    const res = await fetch(
      `http://localhost:5283/api/follows/${user.id}/following`,
    );
    const data = await res.json();
    setFollowing(data.map((u) => u.id));
  };

  useEffect(() => {
    fetchUsers();
    fetchFollowing();
  }, [user]);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem("token");
    if (following.includes(userId)) {
      await fetch(`http://localhost:5283/api/follows/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(following.filter((id) => id !== userId));
    } else {
      await fetch(`http://localhost:5283/api/follows/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing([...following, userId]);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) &&
      u.id !== user?.id,
  );

  return (
    <div className="explore-page">
      <Sidebar />
      <div className="explore-content">
        <div className="explore-header">
          <h2 className="explore-title">Explore</h2>
          <div className="search-bar">
            <FiSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="users-grid">
          {filtered.map((u) => (
            <div key={u.id} className="user-card">
              <div className="user-card-top">
                <div className="user-card-banner" />
                <div className="user-card-avatar">
                  {u.username[0].toUpperCase()}
                </div>
              </div>
              <div className="user-card-body">
                <h3 className="user-card-name">@{u.username}</h3>
                <p className="user-card-bio">{u.bio || "No bio yet"}</p>
                <button
                  className={`user-follow-btn ${following.includes(u.id) ? "following" : ""}`}
                  onClick={() => handleFollow(u.id)}
                >
                  {following.includes(u.id) ? (
                    <>
                      <FiUserCheck size={15} /> Following
                    </>
                  ) : (
                    <>
                      <FiUserPlus size={15} /> Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="no-results">
              <FiSearch size={40} className="no-results-icon" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
      <RightPanel />
    </div>
  );
}

export default ExplorePage;
