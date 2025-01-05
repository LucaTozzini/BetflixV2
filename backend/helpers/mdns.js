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

// 00:15:5D is the start of Hyper-V MAC addresses (virtual machines)
// https://macaddress.io/faq/how-to-recognise-a-microsoft-hyper-v-virtual-machine-by-its-mac-address

const allInterf = os.networkInterfaces();
const validInterf = [];
for (const type in allInterf) {
  for (const interf of allInterf[type]) {
    // skip internal/virtual interfaces (VPNs)
    if (
      interf.mac === "00:00:00:00:00:00" ||
      interf.mac.toLocaleLowerCase().startsWith("00:15:5d") ||
      interf.internal
    )
      continue;

    // Only use IPv4 for now
    if (interf.family !== "IPv4") continue;

    validInterf.push({ address: interf.address, family: interf.family });
  }
}

if (!validInterf.length) throw new Error("No valid interfaces found");

// #region Answers
const answerPTR = {
  name: "_http._tcp.local",
  type: "PTR",
  data: "Betflix.local",
  class: "IN",
  ttl: TTL,
};

// advertise all valid interfaces
const answerA = validInterf.map((interf) => ({
  name: "Betflix.local",
  type: "A",
  data: interf.address,
  class: "IN",
  ttl: TTL,
}));

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

const server = dgram.createSocket({ type: "udp4", reuseAddr: true });

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
          answers.push(...answerA);
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
  // add first valid interface to multicast group
  server.addMembership(MULTICAST_ADDRESS, validInterf[0].address);

  // set outgoing interface to first valid interface
  server.setMulticastInterface(validInterf[0].address);

  console.log(
    `mDNS server listening with ${validInterf[0].address}, advertising`,
    validInterf.map((i) => i.address)
  );

  // send initial response
  respond(
    [answerPTR, ...answerA, answerSRV, answerTXT],
    MULTICAST_PORT,
    MULTICAST_ADDRESS
  );
});

// listen for all traffic destined for the multicast port
server.bind(MULTICAST_PORT);
