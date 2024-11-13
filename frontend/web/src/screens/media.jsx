import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useQueries from "../hooks/useQueries";
import styles from "../styles/media.module.css";

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original"

/**
 * Convert seconds to a readable time string
 * @param {number} s
 * @returns {string}
 */
function secondsToString(s) {
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

export function LocalMedia() {
  const { mediaId } = useParams();
  const media = useQueries();

  useEffect(() => {
    media.selectMedia(mediaId);
  }, []);

  return (
    <div id="outlet" className={styles.container}>
      <div className={styles.wrap}>
        <h1>
          {media.data?.title} <span>{media.data?.year}</span>
        </h1>
        <h3>{secondsToString(media.data?.duration)}</h3>
        <span>
          <button>Play</button>
          <button>Link</button>
        </span>
      </div>
    </div>
  );
}

export function ExternalMedia() {
  const { imdbId } = useParams();
  const media = useQueries();

  useEffect(() => {
    media.fetchMovieDetails(imdbId);
  }, []);

  useEffect(() => {
    console.log(media.data)
  }, [media.data])

  return (
    <div id="outlet" className={styles.container}>
      {media.data?.backdrop_path && <img src={TMDB_IMG_BASE + media.data.backdrop_path} alt="backdrop" />}
      <div className={styles.wrap}>
      <h1>
        {media.data?.title} <span>{media.data?.release_date?.split("-")[0]}</span>
      </h1>
      <h3>{secondsToString(media.data?.runtime * 60)}</h3>
      <p>{media.data?.overview}</p>

      </div>
    </div>
  );
}
