import styles from "../styles/media-table.module.css";
import { Link } from "react-router-dom";

export function MediaTable({ title, children }) {
  return (
    <div className={styles.table}>
      <h2>{title} <span>{children?.length ?? 0}</span></h2>
      <div>
        <div className={styles.row}>
          <div>Title</div>
          <div>Year</div>
          <div>Type</div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function MediaRow({ media_id, tmdb_id, title, year, type }) {
  return (
    <Link to={"/media/"+media_id} className={styles.row}>
      <div className={styles.title}>{title}</div>
      <div className={styles.year}>{year ?? "-"}</div>
      <div className={styles.type}>{type}</div>
    </Link>
  );
}
