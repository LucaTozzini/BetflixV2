import styles from "../styles/search.module.css";
import useQueries from "../hooks/useQueries";
import { MediaTable, MediaRow } from "../components/media-table";
import { useEffect, useLayoutEffect } from "react";
export default function Search() {
  const externalMovies = useQueries();

  useLayoutEffect(() => {
    document.title = "Search | Betflix"
  }, [])

  useEffect(() => {
    document.getElementById("search-input").select();
  }, []);

  function handleChange(e) {
    externalMovies.fetchMovies(e.target.value);
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
        {externalMovies.data && (
          <MediaTable title={"External Movies"}>
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
