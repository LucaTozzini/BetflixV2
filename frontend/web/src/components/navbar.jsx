import styles from "../styles/navbar.module.css"

export default function Navbar(){
  return (
    <nav className={styles.container}>
      <div>
      <a href="/">1</a>
      <a href="/">2</a>
      <a href="/console">3</a>
      </div>
      <div></div>
    </nav>
  )
}