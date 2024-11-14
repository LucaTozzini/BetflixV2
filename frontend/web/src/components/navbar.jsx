import styles from "../styles/navbar.module.css"
import { Link } from "react-router-dom"

export default function Navbar(){
  return (
    <nav className={styles.container}>
      <div>
      <Link to="/">1</Link>
      <Link to="/search">2</Link>
      <Link to="/console">3</Link>
      </div>
      <div></div>
    </nav>
  )
}