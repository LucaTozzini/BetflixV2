import { useEffect, useLayoutEffect } from "react";
import { MediaTable, MediaRow } from "../components/media-table";
import useQueries from "../hooks/useQueries";
import styles from "../styles/browse.module.css";
export default function Browse() {
  const latest = useQueries();
  const popularMovies = useQueries();

  useLayoutEffect(() => {
    document.title = "Browse | Betflix"
  }, [])

  useEffect(() => {
    latest.selectMediaCollection(null, 30, "year", true, null);
    popularMovies.fetchPopularMovies();
  }, []);

  return (
    <div id="outlet" className={styles.container}>
      <div className={styles.wrap}>
        <MediaTable title={"Latest"}>
          {latest.data?.map((i) => (
            <MediaRow
              key={i.media_id}
              mediaId={i.media_id}
              title={i.title}
              type={i.type}
              year={i.year}
            />
          ))}
        </MediaTable>

        <MediaTable title={"Popular Movies"}>
          {popularMovies.data?.map((i) => (
            <MediaRow
              key={i.id}
              tmdbId={i.id}
              title={i.title}
              year={i.release_date?.split("-")[0]}
              type={"movie"}
            />
          ))}
        </MediaTable>
      </div>
    </div>
  );
}
