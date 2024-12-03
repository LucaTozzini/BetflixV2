import styles from "../styles/episodes-table.module.css";
import { useNavigate } from "react-router-dom";

/**
 * Convert seconds to a readable time string
 * @param {number} s
 * @returns {string}
 */
function secondsToString(s) {
  if (isNaN(s)) {
    return "";
  }
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return [
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    !hours && !minutes ? `${seconds}s` : "",
  ]
    .filter((i) => i)
    .join(" ");
}

export function EpisodesTable({ children }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Season</th>
            <th>Episode</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function EpisodeRow({ mediaId, seasonNum, episodeNum, duration }) {
  const navigate = useNavigate();
  return (
    <tr
      onClick={() =>
        navigate(`/video/${mediaId}?s=${seasonNum}&e=${episodeNum}`)
      }
    >
      <td data-cell="seasonNum">{seasonNum}</td>
      <td data-cell="episodeNum">{episodeNum}</td>
      <td data-cell="duration">{secondsToString(duration)}</td>
    </tr>
  );
}
