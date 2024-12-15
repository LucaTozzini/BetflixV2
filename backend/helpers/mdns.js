/* 
Mobile App will attemp to discover this server through mDNS
Usually requests it like this:
  Query PTR for _http._tcp.local
  Once it has PTR, query ANY for name service.local (Betflix.local)

  Make sure IP is physical and not virtual (VPN) when sending A record
*/
import os from "node:os";
import dgram from "node:dgram";
import dnsPacket from "dns-packet";
import dotenv from "dotenv";
dotenv.config();

const MULTICAST_ADDRESS = "224.0.0.251";
const MULTICAST_PORT = 5353;
const TTL = 100; // in seconds

const allInterf = os.networkInterfaces();
const validInterf = [];
for (const type in allInterf)
  for (const interf of allInterf[type]) {
    // skip internal/virtual interfaces (VPNs)
    if (interf.mac === "00:00:00:00:00:00" || interf.internal) continue;

    // Only use IPv4 for now
    if (interf.family !== "IPv4") continue;

    validInterf.push({ address: interf.address, family: interf.family });
  }

for (const interf of validInterf) {
  const server = dgram.createSocket({ type: "udp4", reuseAddr: true });

  // #region Answers
  const answerPTR = {
    name: "_http._tcp.local",
    type: "PTR",
    data: "Betflix.local",
    class: "IN",
    ttl: TTL,
  };

  const answerA = {
    name: "Betflix.local",
    type: "A",
    data: interf.address, // Example IP address
    class: "IN",
    ttl: TTL,
  };

  const answerSRV = {
    name: "Betflix.local",
    type: "SRV",
    data: {
      port: process.env.SERVER_PORT,
      target: "Betflix.local",
    },
    class: "IN",
    ttl: TTL,
  };

  const answerTXT = {
    name: "Betflix.local",
    type: "TXT",
    data: "Local Server for Betflix 2.0",
    class: "IN",
    ttl: TTL,
  };
  // #endregion

  function respond(answers, port, address) {
    const buf = dnsPacket.encode({
      type: "response",
      answers,
    });

    server.send(buf, 0, buf.length, port, address, (err, bytes) => {
      if (err) console.error(err);
    });
  }

  function handleMessage(msg, rinfo) {
    try {
      const packet = dnsPacket.decode(msg, 0);
      if (packet.type === "query") {
        const answers = [];
        for (const question of packet.questions) {
          if (question.name === "_http._tcp.local" && question.type === "PTR") {
            answers.push(answerPTR);
          } else if (
            question.name === "Betflix.local" &&
            question.type === "ANY"
          ) {
            answers.push(answerA);
            answers.push(answerSRV);
            answers.push(answerTXT);
          }
        }
        if (answers.length) respond(answers, rinfo.port, rinfo.address);
      }
    } catch (err) {
      // console.error("mdns handleMessage() error ->", err.message);
    }
  }

  server.on("error", (err) => {
    console.error(err.stack);
    server.close();
  });

  server.on("message", handleMessage);

  server.on("listening", () => {
    const address = server.address();
    console.log(`mDNS server listening @ ${address.address}:${address.port}`);
    server.addMembership(MULTICAST_ADDRESS, interf.address);
    respond(
      [answerPTR, answerA, answerSRV, answerTXT],
      MULTICAST_PORT,
      MULTICAST_ADDRESS
    );
  });

  server.bind(MULTICAST_PORT, interf.address);
}
