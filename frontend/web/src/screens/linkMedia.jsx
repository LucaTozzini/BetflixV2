/*
How to Link Local to External
- Search TMDb with the parsed name of the local file
- Present quick matches
- Manual search for better results
- Select tmdbId to link to mediaId... POST /link

TMDb movie search result example (ommitted irrelevant):
[
  {
    backdrop_path: "/rXrpYOveFl76ivMmyb2612T7Q8w.jpg"
    id: 64688
    poster_path: "/8v3Sqv9UcIUC4ebmpKWROqPBINZ.jpg"
    release_date: "2012-03-14"
    title: "21 Jump Street"
  },
  ...
]
vote_count: 10222
*/
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/original";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/linkMedia.module.css";
import useQueries from "../hooks/useQueries";
import usePosts from "../hooks/usePosts";

export default function LinkMedia() {
  const { mediaId } = useParams();
  const search = useQueries();
  const local = useQueries();
  const { postLink } = usePosts();

  const [title, setTitle] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    local.selectMedia(mediaId);
  }, []);

  useEffect(() => {
    if (local.data) {
      document.getElementById("title-input").value = local.data.title;
      document.getElementById("year-input").value = local.data.year;
      setTitle(local.data.title);
      setYear(0);
    }
  }, [local.data]);

  useEffect(() => {
    if (year !== null && title) {
      console.log(title, year);
      search.fetchMovies(title, year);
    }
  }, [year, title]);

  const MediaItem = ({ title, year, imageURL }) => (
    <div className={styles.mediaItem}>
      <img
        src={
          imageURL ??
          "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
        }
        alt="media poster"
      />
      <p>
        {title} <span>{year}</span>
      </p>
      <button
        onClick={async () => {
          const status = await postLink(mediaId, tmdbId);
          if (status === 201) {
          }
        }}
      >
        Select
      </button>
    </div>
  );

  return (
    <div id="outlet" className={styles.container}>
      <div>
        <input
          id="title-input"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          id="year-input"
          type="number"
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className={styles.results}>
        {search.data?.map((i) => (
          <MediaItem
            key={i.id}
            tmdbId={i.id}
            title={i.title}
            year={i.release_date?.split("-")[0]}
            imageURL={i.poster_path ? `${TMDB_IMG_BASE}${i.poster_path}` : null}
          />
        ))}
      </div>
    </div>
  );
}
