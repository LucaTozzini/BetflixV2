import styles from "../styles/media-table.module.css";
import { useNavigate } from "react-router-dom";

export function MediaTable({ title, children }) {
  return (
    <div className={styles.container}>
      <h2>
        {title} <span>{children?.length ?? 0}</span>
      </h2>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Genres</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function MediaRow({ mediaId, tmdbId, title, year, genres, type }) {
  const navigate = useNavigate();
  return (
    <tr
      onClick={() =>
        navigate(mediaId ? `/media/${mediaId}` : `/external/${tmdbId}`)
      }
    >
      <td data-cell="title">{title ?? "-"}</td>
      <td data-cell="year">{year ?? "-"}</td>
      <td data-cell="genres">{genres ?? "-"}</td>
      <td data-cell="type">{type ?? "-"}</td>
    </tr>
  );
}
