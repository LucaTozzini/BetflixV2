import { useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQueries from "../hooks/useQueries";
import { TorrentsTable, TorrentRow } from "../components/torrents-table";
import styles from "../styles/media.module.css";

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original";

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

const MediaInfo = ({ title, year, duration, buttons, genres, overview }) => {
  const navigate = useNavigate();
  const { mediaId } = useParams();

  return (
    <div className={styles.info}>
      <h1>
        {title} <span>{year}</span>
      </h1>
      <h3>
        {secondsToString(duration)}{" "}
        <span className={styles.genres}>
          {genres ? `| ${genres.join(", ")}` : ""}
        </span>
      </h3>
      {buttons && (
        <span>
          <button onClick={() => navigate(`/video/${mediaId}`)}>Play</button>
          <button>Link</button>
        </span>
      )}
      <p>{overview}</p>
    </div>
  );
};

export function LocalMedia() {
  const { mediaId } = useParams();
  const media = useQueries();

  useLayoutEffect(() => {
    document.title = "Media | Betflix";
  }, []);

  useEffect(() => {
    media.selectMedia(mediaId);
  }, []);

  useEffect(() => {
    if (media.data) {
      document.title = `${media.data.title} | Betflix`;
    }
  }, [media.data]);

  return (
    <div id="outlet" className={styles.container}>
      <div className={styles.wrap}>
        <MediaInfo
          title={media.data?.title}
          year={media.data?.year}
          duration={secondsToString(media.data?.duration)}
          buttons={true}
        />
      </div>
    </div>
  );
}

export function ExternalMedia() {
  const { tmdbId } = useParams();
  const media = useQueries();
  const torrents = useQueries();

  useLayoutEffect(() => {
    document.title = "Media | Betflix";
  }, []);

  useEffect(() => {
    media.fetchMovieDetails(tmdbId);
  }, []);

  useEffect(() => {
    if (media.data?.imdb_id) {
      document.title = `${media.data.title} | Betflix`;
      torrents.fetchMovieTorrents(media.data.imdb_id);
      console.log(media.data);
    }
  }, [media.data]);

  return (
    <div id="outlet" className={styles.container}>
      {media.data?.backdrop_path && (
        <img src={TMDB_IMG_BASE + media.data.backdrop_path} alt="backdrop" />
      )}
      <div className={styles.wrap}>
        <MediaInfo
          title={media.data?.title}
          year={media.data?.release_date?.split("-")[0]}
          duration={media.data?.runtime * 60}
          overview={media.data?.overview}
          genres={media.data?.genres?.map((i) => i.name)}
        />
        <TorrentsTable>
          {torrents.data?.map((i, index) => (
            <TorrentRow
              key={index}
              quality={i.quality}
              type={i.type}
              seeds={i.seeds}
              peers={i.peers}
              size={i.size}
              codec={i.video_codec}
              uploaded={i.date_uploaded.split(" ")[0]}
            />
          ))}
        </TorrentsTable>
      </div>
    </div>
  );
}
