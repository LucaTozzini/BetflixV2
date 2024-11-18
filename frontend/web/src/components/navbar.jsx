import styles from "../styles/navbar.module.css"
import { Link } from "react-router-dom"

export default function Navbar(){
  return (
    <nav className={styles.container}>
      <div>
      <Link to="/">Brws</Link>
      <Link to="/search">Srch</Link>
      <Link to="/downloads">Dwnl</Link>
      <Link to="/console">Cons</Link>
      </div>
      <div></div>
    </nav>
  )
}