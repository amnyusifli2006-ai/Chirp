import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineCompass, AiOutlineUser } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="sidebar">
        <Logo />
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${isActive("/home") ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <AiOutlineHome size={22} /> <span>Home</span>
          </button>
          <button
            className={`nav-item ${isActive("/explore") ? "active" : ""}`}
            onClick={() => navigate("/explore")}
          >
            <AiOutlineCompass size={22} /> <span>Explore</span>
          </button>
          <button
            className={`nav-item ${isActive("/profile") ? "active" : ""}`}
            onClick={() => navigate("/profile")}
          >
            <AiOutlineUser size={22} /> <span>Profile</span>
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="sidebar-username">@{user?.username}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <BiLogOut size={20} /> <span>Sign Out</span>
        </button>
      </div>

      {/* Mobil Tab Bar */}
      <div className="mobile-tabbar">
        <button
          className={`tab-btn ${isActive("/home") ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <AiOutlineHome size={24} /> Home
        </button>
        <button
          className={`tab-btn ${isActive("/explore") ? "active" : ""}`}
          onClick={() => navigate("/explore")}
        >
          <AiOutlineCompass size={24} /> Explore
        </button>
        <button
          className={`tab-btn ${isActive("/profile") ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <AiOutlineUser size={24} /> Profile
        </button>
        <button className="tab-btn" onClick={handleLogout}>
          <BiLogOut size={24} /> Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
