import { useEffect, useState } from "react";
import styles from "../styles/console.module.css";

export default function Console() {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState(null);
  const [instruct, setInstruct] = useState(null);

  useEffect(() => {
    const s = new WebSocket("ws://localhost:5340");
    s.addEventListener("message", async (event) => {
      const data = await JSON.parse(event.data);
      console.log(data)
      if (data.console) {
        document.getElementById("lines").innerHTML += `<p>${data.console}</p>`;
      }
    });
    s.addEventListener("close", (event) => console.log(event));
    setSocket(s);

    document.getElementById("text-input").select();

    return () => {
      s.close(1000, "Page closed");
    };
  }, []);

  function onKeyPress(e) {
    if (
      e.code == "Enter" &&
      socket &&
      document.getElementById("text-input").value.trim().length
    ) {
      socket.send(document.getElementById("text-input").value.trim());
      document.getElementById("text-input").value = "";
    }
  }

  return (
    <div className={styles.container}>
      <div id="lines"></div>
      <div>
        <p>{">"}</p>
        <input id="text-input" type="text" onKeyDown={onKeyPress} />
      </div>
    </div>
  );
}
