import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../styles/video.module.css";
import { useEffect, useState } from "react";
import useQueries from "../hooks/useQueries";

const SERVER = "localhost:5340";

export default function Video() {
  const media = useQueries();
  const navigate = useNavigate();
  const { mediaId } = useParams();
  const [streamEndpoint, setStreamEndpoint] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const seasoNum = searchParams.get("s");
  const episodeNum = searchParams.get("e");

  useEffect(() => {
    document.title = "Streaming | Betflix";
    media.selectMedia(mediaId);
    document.getElementById("video").addEventListener("error", (event) => {
      // 404 response
      if (event.target.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        navigate("/404", { replace: true });
      }
    });

    if (seasoNum && episodeNum) {
      setStreamEndpoint(
        `http://${SERVER}/stream/${mediaId}/s${seasoNum}-e${episodeNum}`
      );
    } else {
      setStreamEndpoint(`http://${SERVER}/stream/${mediaId}`);
    }
  }, []);

  useEffect(() => {
    if (media.data) {
      document.title = `Streaming ${media.data.title}`;
    }
  }, [media.data]);

  return (
    <div id="outlet" className={styles.container}>
      <video
        className={styles.video}
        id="video"
        controls
        src={streamEndpoint}
      />
    </div>
  );
}
