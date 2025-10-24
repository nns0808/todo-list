import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header({ title, user, onLogout }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          About
        </NavLink>
      </nav>

      {user ? (
        <div className={styles.userSection}>
          
          <button className={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className={styles.authLinks}>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Sign Up
          </NavLink>
        </div>
      )}
    </header>
  );
}

export default Header;

