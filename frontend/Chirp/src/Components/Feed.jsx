import { useState, useEffect } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { FiHeart, FiMessageCircle, FiSend, FiTrash2 } from "react-icons/fi";
import "./Feed.css";
import { useAuth } from "../context/AuthContext";
function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const { user } = useAuth();
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const fetchPosts = async () => {
    const res = await fetch("http://localhost:5283/api/posts");
    const data = await res.json();
    setPosts(data);
  };
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return parseInt(
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5283/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    setContent("");
    fetchPosts();
  };
  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (likedPosts.includes(postId)) {
      await fetch(`http://localhost:5283/api/likes/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      await fetch(`http://localhost:5283/api/likes/${postId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedPosts([...likedPosts, postId]);
    }
    fetchPosts();
  };
  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5283/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };
  const fetchComments = async (postId) => {
    const res = await fetch(`http://localhost:5283/api/comments/${postId}`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const handleCommentToggle = (postId) => {
    if (!openComments[postId]) {
      fetchComments(postId);
    }
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };
  const handleAddComment = async (postId) => {
    const token = localStorage.getItem("token");
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    await fetch(`http://localhost:5283/api/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchComments(postId);
  };
  return (
    <div className="feed">
      <div className="post-composer">
        <div className="composer-avatar">
          {user?.username?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="composer-right">
          <textarea
            className="composer-input"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="composer-actions">
            <AiOutlinePicture size={22} className="composer-icon" />
            <button className="composer-btn" onClick={handlePost}>
              <FiSend size={16} />
              Chirp
            </button>
          </div>
        </div>
      </div>
      <div className="feed-divider" />
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-avatar">{post.username?.[0]?.toUpperCase()}</div>
          <div className="post-right">
            <div className="post-header">
              <span className="post-username">@{post.username}</span>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {post.userId === getCurrentUserId() && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  <FiTrash2 size={15} />
                </button>
              )}
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-actions">
              <button
                className={`action-btn ${likedPosts.includes(post.id) ? "liked" : ""}`}
                onClick={() => handleLike(post.id)}
              >
                <FiHeart size={17} /> {post.likeCount}
              </button>
              <button
                className="action-btn"
                onClick={() => handleCommentToggle(post.id)}
              >
                <FiMessageCircle size={17} /> Reply
              </button>
            </div>
            {openComments[post.id] && (
              <div className="comments-section">
                {comments[post.id]?.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-avatar">
                      {c.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="comment-body">
                      <span className="comment-username">@{c.username}</span>
                      <p className="comment-content">{c.content}</p>
                    </div>
                  </div>
                ))}

                <div className="comment-input-row">
                  <div className="comment-avatar">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    className="comment-input"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddComment(post.id)
                    }
                  />
                  <button
                    className="comment-send-btn"
                    onClick={() => handleAddComment(post.id)}
                  >
                    <FiSend size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
