import useSocket from "../hooks/useSocket";
import { DownloadsTable, DownloadsRow } from "../components/downloads-table";
import { useEffect, useState } from "react";
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
    <div id="outlet">
      <h1>Active Downloads</h1>
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
