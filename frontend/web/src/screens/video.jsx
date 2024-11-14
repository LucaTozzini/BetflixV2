import { useParams } from "react-router-dom";
import styles from "../styles/video.module.css";

export default function Video() {
  const {mediaId} = useParams();
  return (
    <div id="outlet">
      <video controls src={`http://localhost:5340/v1/stream/${mediaId}`}/>
    </div>
  );
}
