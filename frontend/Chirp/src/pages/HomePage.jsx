import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Feed from "../Components/Feed";
import RightPanel from "../Components/RightPanel";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  return (
    <div className="home-container">
      <Sidebar />
      <Feed />
      <RightPanel />
    </div>
  );
}

export default HomePage;
