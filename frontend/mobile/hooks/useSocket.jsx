// Architecture taken from this implementation: https://ably.com/blog/websockets-react-tutorial
import ServerContext from "../contexts/serverContext";

import { useContext, useEffect, useRef, useState } from "react";
export default function useSocket(endpoint) {
  const serverAddress = useContext(ServerContext);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${serverAddress}${endpoint ?? ""}`);
    socket.onopen = () => setOpen(true);
    socket.onclose = () => setOpen(false);
    socket.onmessage = (event) => setMsg(event.data);
    ws.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  // bind is needed to make sure `send` references correct `this`
  return { open, msg, send: ws.current?.send.bind(ws.current) };
}
