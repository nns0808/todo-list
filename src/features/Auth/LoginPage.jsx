import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

function LoginPage({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const usersTable = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/Users`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const filterUrl = `${usersTable}?filterByFormula={email}="${encodeURIComponent(email)}"`;
    try {
      const resp = await fetch(filterUrl, { headers: { Authorization: token } });
      const data = await resp.json();

      if (data.records.length === 0) {
        setError("User not found");
        return;
      }

      const user = data.records[0].fields;
      if (user.password !== password) {
        setError("Incorrect password");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify({ email: user.email }));
      setCurrentUser({ email: user.email });
      navigate("/");
    } catch {
      setError("Login failed");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
