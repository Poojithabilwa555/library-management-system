import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import LibrarianDashboard from "./components/LibrarianDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (token && username && role) {
      return {
        token,
        username,
        role
      };
    }

    return null;
  });

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setUser(null);
  };

  // Not logged in
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Student
if (user.role === "STUDENT") {
  return (
    <StudentDashboard
      username={user.username}
      onLogout={handleLogout}
      user={user}
    />
  );
}

  // Librarian
  if (user.role === "LIBRARIAN") {
    return (
      <LibrarianDashboard
        user={user}
        logout={handleLogout}
      />
    );
  }

  // Unknown role
  return (
    <div style={{ padding: "40px" }}>
      <h2>Unknown Role</h2>
      <p>Role: {user.role}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;