import { useEffect } from "react";
import { MediaTable, MediaRow } from "../components/media-table";
import Queries from "../hooks/queries";
import styles from "../styles/media.module.css";
export default function Media() {
  const latest = Queries();
  useEffect(() => {
    latest.queryMedia(null, 30, "year", true, null);
  }, []);

  return (
    <div id="outlet" className={styles.container}>
      <MediaTable title={"Latest"}>
        {latest.data.map((i, index) => (
          <MediaRow key={index} title={i.title} type={i.type} year={i.year} />
        ))}
      </MediaTable>
    </div>
  );
}
