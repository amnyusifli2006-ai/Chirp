import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../Components/Logo";
import "./LoginPage.css";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const response = await fetch("http://localhost:5283/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      login(data.user, data.token);
      navigate("/home");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Logo />
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-sub">Sign in to continue</p>

        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button onClick={handleLogin} className="login-button">
          Sign In
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
