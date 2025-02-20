import { useEffect, useState } from "react";
import styles from "../styles/console.module.css";
import useSocket from "../hooks/useSocket";

export default function Console() {
  const socket = useSocket("");
  const [connections, setConnections] = useState(null);

  async function handleMessage(msg) {
    const data = await JSON.parse(msg);
    if (data.console) {
      document.getElementById("lines").innerHTML += `<p>${data.console}</p>`;
      document.getElementById("lines").scrollTop =
        document.getElementById("lines").scrollHeight;
    }
    setConnections(data.connections);
  }

  useEffect(() => {
    document.title = "Console | Betflix";
    document.getElementById("text-input").select();
  }, []);

  useEffect(() => {
    if (socket.msg) {
      handleMessage(socket.msg);
    }
  }, [socket.msg]);

  function onKeyPress(e) {
    if (e.code === "Enter") {
      const textInput = document.getElementById("text-input");
      const textInputValue = textInput.value.trim();

      if (textInputValue === "clr") {
        document.getElementById("lines").innerHTML = "";
      } else if (socket.open && textInputValue.length) {
        socket.send(textInputValue);
      }

      textInput.value = "";
    }
  }

  return (
    <div className={styles.container} id="outlet">
      <div className={styles.topSection}>
        <div className={styles.infoContainer}>
          <h4>
            {connections} Active Connection{connections > 1 ? "s" : ""}
          </h4>
        </div>
        <div id="lines"></div>
      </div>
      <div>
        <p>{">"}</p>
        <input id="text-input" type="text" onKeyDown={onKeyPress} />
      </div>
    </div>
  );
}
