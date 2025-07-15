// udpSender.ts
import dgram from "react-native-udp";

let udpSocket: ReturnType<typeof dgram.createSocket> | null = null;
let isBound = false;
let lastCreatedTime = 0;
const SOCKET_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes

// Internal: creates and binds a new socket
function createNewSocket(): Promise<ReturnType<typeof dgram.createSocket>> {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket({ type: "udp4" });


    socket.on("error", (err) => {
      console.error("❌ UDP socket error:", err);
      socket.close();
      udpSocket = null;
      isBound = false;
    });

    socket.bind(0, () => {
      isBound = true;
      lastCreatedTime = Date.now();
      console.log("✅ UDP socket bound and ready");
      resolve(socket);
    });
  });
}

// Internal: returns a good socket (creating or recycling as needed)
async function getReusableSocket(): Promise<ReturnType<typeof dgram.createSocket>> {
  const now = Date.now();

  const needsRecycle =
    !udpSocket ||
    !isBound ||
    now - lastCreatedTime > SOCKET_LIFETIME_MS;

  if (needsRecycle) {
    if (udpSocket) {
      console.log("♻️ Recycling old UDP socket");
      udpSocket.close();
    }
    udpSocket = await createNewSocket();
  }

  return udpSocket!;
}

// Public: send command using managed socket
export async function sendUdpCommand({
  ip,
  port,
  message,
}: {
  ip: string;
  port: string;
  message: string;
}) {
  try {
    const socket = await getReusableSocket();
    const buffer = Buffer.from(message);

    await new Promise<void>((resolve, reject) => {
      socket.send(buffer, 0, buffer.length, parseInt(port, 10), ip, (err) => {
        if (err) {
          console.error(`❌ Error sending to ${ip}:${port}:`, err);
          reject(err);
        } else {
          console.log(`✅ Sent "${message}" to ${ip}:${port}`);
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("❌ sendUdpCommand failed:", err);
  }
}
