import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import RightPanel from "../Components/RightPanel";
import "./ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });

  const fetchPosts = async () => {
    if (!user) return;
    const res = await fetch(`http://localhost:5283/api/posts/user/${user.id}`);
    const data = await res.json();
    setPosts(data);
  };

  const fetchStats = async () => {
    if (!user) return;
    const [fRes, fgRes] = await Promise.all([
      fetch(`http://localhost:5283/api/follows/${user.id}/followers`),
      fetch(`http://localhost:5283/api/follows/${user.id}/following`),
    ]);
    const followers = await fRes.json();
    const following = await fgRes.json();
    setStats({ followers: followers.length, following: following.length });
  };

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [user]);

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5283/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-banner" />
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="profile-details">
              <h2 className="profile-username">@{user?.username}</h2>
              <div className="profile-stats">
                <span>
                  <strong>{posts.length}</strong> Chirps
                </span>
                <span>
                  <strong>{stats.followers}</strong> Followers
                </span>
                <span>
                  <strong>{stats.following}</strong> Following
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-posts">
          {posts.length === 0 && <p className="no-posts">No chirps yet!</p>}
          {posts.map((post) => (
            <div key={post.id} className="profile-post-card">
              <div className="profile-post-header">
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
              <p className="profile-post-content">{post.content}</p>
              <div className="profile-post-footer">
                <span className="post-likes">
                  <FiHeart size={14} /> {post.likeCount || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <RightPanel />
    </div>
  );
}

export default ProfilePage;
