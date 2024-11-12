import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useQueries from "../hooks/useQueries";
import styles from "../styles/media.module.css"

export default function Media() {
  const { mediaId } = useParams();
  const media = useQueries()

  /**
   * Convert seconds to a readable time string
   * @param {number} s
   * @returns {string} 
   */
  function secondsToString(s) {
    const hours = Math.floor(s / 3600)
    const minutes = Math.floor((s % 3600) / 60)
    const seconds = s % 60
    return [hours ? `${hours}h` : null, minutes ? `${minutes}m` : null, !hours && !minutes ? `${seconds}s` : ""].filter(i => i).join(" "); 
  }

  useEffect(() => {
    media.selectMedia(mediaId);
  }, [])

  return (
    <div id="outlet" className={styles.container}>
      <h1>{media.data?.title} <span>{media.data?.year}</span></h1>
      <h3>{secondsToString(media.data?.duration)}</h3>
      <span><button>Play</button><button>Link</button></span>
    </div>
  );
}
