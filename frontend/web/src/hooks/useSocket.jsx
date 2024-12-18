// Architecture taken from this implementation: https://ably.com/blog/websockets-react-tutorial

import { useEffect, useRef, useState } from "react";

// for dev
// const SERVER_ADDRESS = "ws://localhost:5340";

// for build
const SERVER_ADDRESS = "";

export default function useSocket(endpoint) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`${SERVER_ADDRESS}${endpoint ?? ""}`);
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
