import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../Components/Logo";
import "./RegisterPage.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    const response = await fetch("http://localhost:5283/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      const data = await response.json();
      setError(data.message || "Something went wrong.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <Logo />
        <h1 className="register-title">Create Account</h1>
        <p className="register-sub">Join Chirp today</p>

        {error && <p className="register-error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        <button onClick={handleRegister} className="register-button">
          Sign Up
        </button>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
