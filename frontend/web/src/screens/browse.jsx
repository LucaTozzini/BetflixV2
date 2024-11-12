import { useEffect } from "react";
import { MediaTable, MediaRow } from "../components/media-table";
import useQueries from "../hooks/useQueries";
import styles from "../styles/browse.module.css";
export default function Browse() {
  const latest = useQueries();
  const popularMovies = useQueries();
  useEffect(() => {
    latest.selectMediaCollection(null, 30, "year", true, null);
    popularMovies.fetchPopularMovies();
  }, []);

  return (
    <div id="outlet" className={styles.container}>
      <MediaTable title={"Latest"}>
        {latest.data?.map((i) => (
          <MediaRow
            key={i.media_id}
            media_id={i.media_id}
            title={i.title}
            type={i.type}
            year={i.year}
          />
        ))}
      </MediaTable>

      <MediaTable title={"Popular Movies"}>
        {popularMovies.data?.map((i) => (
          <MediaRow key={i.id} tmdb_id={i.id} title={i.title} type={"movie"} />
        ))}
      </MediaTable>
    </div>
  );
}
