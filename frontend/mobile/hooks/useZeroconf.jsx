// https://www.npmjs.com/package/react-native-zeroconf
import { useEffect, useState } from "react";
import Zeroconf from "react-native-zeroconf";

export default function useZeroconf() {
  const [serverAddress, setServerAddress] = useState(null);

  useEffect(() => {
    const zeroconf = new Zeroconf();

    function handleResolve(service) {
      if (service.name !== "Betflix" || !service.host || !service.port) return;
      const address = service.host + ":" + service.port;
      setServerAddress(address);
      zeroconf.stop();
    }

    // zeroconf.on("start", () => console.log("zeroconf started."));
    // zeroconf.on("stop", () => console.log("zeroconf stopped."));
    // zeroconf.on("found", (name) => console.log("zeroconf found", name));
    zeroconf.on("resolved", handleResolve);
    // setServerAddress("192.168.1.76:5340")
    zeroconf.scan("http", "tcp", "local.");
    return () => {
      zeroconf.stop();
    };

  }, []);

  return serverAddress;
}
