import styles from "../styles/search.module.css";
import useQueries from "../hooks/useQueries";
import { MediaTable, MediaRow } from "../components/media-table";
import { useEffect, useLayoutEffect } from "react";
export default function Search() {
  const externalMovies = useQueries();
  const localMedia = useQueries();

  useLayoutEffect(() => {
    document.title = "Search | Betflix";
  }, []);

  useEffect(() => {
    document.getElementById("search-input").select();
  }, []);

  function handleChange(e) {
    externalMovies.fetchMovies(e.target.value);
    localMedia.searchMedia(e.target.value);
  }

  return (
    <div id="outlet" className={styles.container}>
      <input
        type="text"
        id="search-input"
        className={styles.input}
        onChange={handleChange}
        placeholder="Search for movies and tv shows..."
      />
      <div className={styles.wrap}>
        {localMedia.data && localMedia.data.length > 0 && (
          <MediaTable title={"Local Media"}>
            {localMedia.data.map((i) => (
              <MediaRow
                key={i.media_id}
                mediaId={i.media_id}
                title={i.link_title ?? i.title}
                year={i.year}
                type={i.type}
                genres={i.genres}
              />
            ))}
          </MediaTable>
        )}
        {externalMovies.data && (
          <MediaTable title={"TMDb Movies"}>
            {externalMovies.data.map((i) => (
              <MediaRow
                key={i.id}
                tmdbId={i.id}
                title={i.title}
                year={i.release_date?.split("-")[0]}
                type={"movie"}
              />
            ))}
          </MediaTable>
        )}
      </div>
    </div>
  );
}
