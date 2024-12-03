import { replace, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/video.module.css";
import { useEffect, useLayoutEffect } from "react";
import useQueries from "../hooks/useQueries";

export default function Video() {
  const media = useQueries()
  const {mediaId} = useParams();
  const navigate = useNavigate()
  useLayoutEffect(() => {
    document.title = "Streaming | Betflix"
  }, [])

  useEffect(() => {
    media.selectMedia(mediaId);
    document.getElementById("video").addEventListener("error", (event) => {
      // 404 response
      if(event.target.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        navigate("/404", {replace: true})
      }
    })
  }, [])

  useEffect(() => {
    if(media.data) {
      console.log(media.data);
      document.title = `Streaming ${media.data.title}`
    }
  }, [media.data])

  return (
    <div id="outlet" className={styles.container}>
      <video className={styles.video} id="video" controls src={`http://localhost:5340/stream/${mediaId}`}/>
    </div>
  );
}
