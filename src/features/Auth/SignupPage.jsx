import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css"; // if you have CSS

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const usersTable = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/Users`;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if user exists
    const checkUrl = `${usersTable}?filterByFormula={email}="${encodeURIComponent(email)}"`;
    const checkResp = await fetch(checkUrl, { headers: { Authorization: token } });
    const checkData = await checkResp.json();
    if (checkData.records.length > 0) {
      setError("Email already exists. Please log in.");
      return;
    }

    // Create new user
    const payload = { records: [{ fields: { email, password } }] };

    try {
      const resp = await fetch(usersTable, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error("Failed to create user");

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form onSubmit={handleSignup} className={styles.signupForm}>
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
