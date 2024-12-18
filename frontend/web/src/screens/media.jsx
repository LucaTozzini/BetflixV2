import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useDeletes from "../hooks/useDeletes";
import useQueries from "../hooks/useQueries";
import { useNavigate, useParams } from "react-router-dom";
import { TorrentsTable, TorrentRow } from "../components/torrents-table";
import { EpisodeRow, EpisodesTable } from "../components/episodes-table";
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

const MediaInfo = ({
  title,
  year,
  duration,
  buttons,
  linked,
  genres,
  vote, // Assume out of 5
  overview,
}) => {
  const { mediaId } = useParams();
  const { deleteLink } = useDeletes();
  const navigate = useNavigate();

  return (
    <div className={styles.info}>
      <h1>
        {title} <span>{year}</span>
      </h1>
      <h3>
        {secondsToString(duration)}{" "}
        <span className={styles.genres}>{genres}</span>{" "}
        {vote && (
          <span>
            {"⭐".repeat(vote)}
            {"🍅".repeat(5 - vote)}
          </span>
        )}
      </h3>
      {buttons && (
        <div className={styles.buttons}>
          <Link to={`/video/${mediaId}`}>Play</Link>
          {!linked && <Link to={`/link-media/${mediaId}`}>Link</Link>}
          {linked && (
            <button
              onClick={async () => {
                const response = await deleteLink(mediaId);
                if (response.ok) {
                  navigate(0);
                }
              }}
            >
              Unlink
            </button>
          )}
        </div>
      )}
      <p>{overview}</p>
    </div>
  );
};

export function LocalMedia() {
  const { mediaId } = useParams();
  const media = useQueries();
  const mediaLink = useQueries();
  const external = useQueries();
  const episodes = useQueries();
  const seasons = useQueries();
  const [curSeason, setCurSeason] = useState(null);

  useEffect(() => {
    document.title = "Media | Betflix";
    media.selectMedia(mediaId);
    mediaLink.selectLink({ mediaId });
  }, []);

  useEffect(() => {
    if (mediaLink.data && media.data) {
      if (media.data.type === "movie") {
        external.fetchMovieDetails(mediaLink.data.tmdb_id);
      } else {
        external.fetchShowDetails(mediaLink.data.tmdb_id);
      }
    }
  }, [mediaLink.data, media.data]);

  useEffect(() => {
    if (media.data) {
      document.title = `${media.data.title} | Betflix`;
      if (media.data.type === "show") {
        seasons.selectSeasons(mediaId);
      }
    }
  }, [media.data]);

  useEffect(() => {
    if (seasons.data?.length) {
      setCurSeason(seasons.data[0].season_num);
    }
  }, [seasons.data]);

  useEffect(() => {
    if (curSeason !== null) {
      episodes.selectSeason(mediaId, curSeason);
    }
  }, [curSeason]);

  const Episodes = () => {
    if (curSeason === null) return;
    return (
      <>
        <select
          className={styles.select}
          value={curSeason}
          onChange={(i) => setCurSeason(i.target.value)}
        >
          {seasons.data?.map(({ season_num }, i) => (
            <option key={i} value={season_num}>
              Season {season_num}
            </option>
          ))}
        </select>
        <EpisodesTable>
          {episodes.data?.map((i) => (
            <EpisodeRow
              key={`${i.media_id}_${i.season_num}_${i.episode_num}`}
              mediaId={i.media_id}
              seasonNum={i.season_num}
              episodeNum={i.episode_num}
              duration={i.duration}
            />
          ))}
        </EpisodesTable>
      </>
    );
  };

  return (
    <div id="outlet" className={styles.container}>
      {mediaLink.data?.poster_path && (
        <img
          src={TMDB_IMG_BASE + mediaLink.data?.backdrop_path}
          alt="backdrop"
        />
      )}
      <div className={styles.wrap}>
        <MediaInfo
          title={mediaLink.data?.title ?? media.data?.title}
          year={media.data?.year}
          duration={media.data?.duration}
          overview={mediaLink.data?.overview}
          genres={mediaLink.data?.genres}
          buttons={true}
          linked={mediaLink.data != null}
          vote={
            external.data?.vote_average
              ? Math.round(external.data?.vote_average / 2)
              : null
          }
        />
        {media.data?.type === "show" && <Episodes />}
      </div>
    </div>
  );
}

export function ExternalMedia() {
  const { tmdbId } = useParams();
  const media = useQueries();
  const link = useQueries();
  const torrents = useQueries();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Media | Betflix";
    link.selectLink({ tmdbId });
    media.fetchMovieDetails(tmdbId);
  }, []);

  useEffect(() => {
    if (link.data?.media_id) {
      navigate(`/media/${link.data.media_id}`, { replace: true });
    }
  }, [link.data]);

  useEffect(() => {
    if (media.data?.imdb_id) {
      console.log(media.data);
      document.title = `${media.data.title} | Betflix`;
      torrents.fetchMovieTorrents(media.data.imdb_id);
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
          genres={media.data?.genres?.map((i) => i.name).join(", ")}
          vote={
            media.data?.vote_average
              ? Math.round(media.data?.vote_average / 2)
              : null
          } // vote_average range = [0, 10], convert to [0, 5]
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
              url={i.url}
            />
          ))}
        </TorrentsTable>
      </div>
    </div>
  );
}
