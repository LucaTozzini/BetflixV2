import { useParams } from "react-router-dom";
import styles from "../styles/video.module.css";
import { useEffect, useLayoutEffect } from "react";
import useQueries from "../hooks/useQueries";

export default function Video() {
  const media = useQueries()
  const {mediaId} = useParams();
  useLayoutEffect(() => {
    document.title = "Streaming | Betflix"
  }, [])

  useEffect(() => {
    media.selectMedia(mediaId);
  }, [])

  useEffect(() => {
    if(media.data) {
      console.log(media.data);
      document.title = `Streaming ${media.data.title}`
    }
  }, [media.data])

  return (
    <div id="outlet" className={styles.container}>
      <video className={styles.video} controls src={`http://localhost:5340/stream/${mediaId}`}/>
    </div>
  );
}
