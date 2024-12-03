import styles from "../styles/navbar.module.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={styles.container}>
      <div>
        <Link to="/">🎬 Browse</Link>
        <Link to="/search">🔎 Search</Link>
        <Link to="/downloads">⬇️ Downloads</Link>
      </div>
      <div>
        <Link to="/console">🖥️ Console</Link>
      </div>
    </nav>
  );
}
