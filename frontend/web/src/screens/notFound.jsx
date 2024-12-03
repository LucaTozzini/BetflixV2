import styles from "../styles/notFound.module.css"
import { Link } from "react-router-dom"
export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404 Page Not Found</h1>
      <Link>Back to Browse</Link>
      <img src="https://i.imgur.com/qhMbkGi.jpg" alt="gif of john being confused" />
    </div>
  )
}