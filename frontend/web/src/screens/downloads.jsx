import useSocket from "../hooks/useSocket";
import { DownloadsTable, DownloadsRow } from "../components/downloads-table";
import { useEffect, useState } from "react";
import styles from "../styles/downloads.module.css"
export default function Downloads() {
  const [data, setData] = useState(null);
  const socket = useSocket("/downloads");

  async function handleMessage(msg) {
    const data = await JSON.parse(msg);
    setData(data);
  }

  useEffect(() => {
    if (socket.msg) {
      handleMessage(socket.msg);
    }
  }, [socket.msg]);

  return (
    <div id="outlet" className={styles.container}>
      <h2>Active Downloads <span>{data?.length ?? 0}</span></h2>
      <DownloadsTable>
        {data?.map((i) => (
          <DownloadsRow
            key={i.name}
            name={i.name}
            progress={parseInt(i.progress * 10000) / 100}
            timeRemaining={i.timeRemaining}
            downloadSpeed={i.downloadSpeed}
          />
        ))}
      </DownloadsTable>
    </div>
  );
}
