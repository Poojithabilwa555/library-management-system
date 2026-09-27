import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(
        `${API}/auth/login`,
        {
          username: username.trim(),
          password: password
        }
      );

      const {
        token,
        username: loggedUsername,
        role
      } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", loggedUsername);
      localStorage.setItem("role", role);

      onLogin({
        token,
        username: loggedUsername,
        role
      });

    } catch (error) {

      console.error("Login error:", error);

      if (error.response) {

        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Invalid username or password"
        );

      } else {

        setError(
          "Unable to connect to the library server."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-visual">

        <div className="visual-content">

          <div className="big-book-icon">
            📚
          </div>

          <h2>
            Welcome to your
            <br />
            <span>Digital Library</span>
          </h2>

          <p>
            Explore books, manage borrowing,
            and stay connected with your library.
          </p>

          <div className="book-decoration">

            <div className="mini-book book-one">
              📕
            </div>

            <div className="mini-book book-two">
              📗
            </div>

            <div className="mini-book book-three">
              📘
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-section">

        <div className="login-card">

          <div className="login-card-logo">
            📖
          </div>

          <h1>
            Library Management System
          </h1>

          <p className="login-subtitle">
            Sign in to access your library account
          </p>


          <form onSubmit={handleLogin}>

            {/* USERNAME */}

            <div className="input-group">

              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (

              <div className="login-error">
                ⚠️ {error}
              </div>

            )}


            {/* BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign In →"}

            </button>

          </form>


          <div className="login-security">
            🔐 Secure Library Access
          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;