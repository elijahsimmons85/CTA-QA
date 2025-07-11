import dgram from "react-native-udp";

export async function sendUdpCommand({
  ip,
  port,
  message,
}: {
  ip: string;
  port: string;
  message: string;
}) {
  return new Promise<void>((resolve, reject) => {
    const socket = dgram.createSocket({ type: "udp4" });

    socket.bind(0, () => {
      console.log(
        `🔹 Sending UDP message "${message}" to ${ip}:${port}`
      );
      socket.send(
        Buffer.from(message),
        0,
        message.length,
        parseInt(port, 10),
        ip,
        (err) => {
          socket.close();
          if (err) {
            console.error("❌ UDP send error:", err);
            reject(err);
          } else {
            console.log("✅ UDP message sent successfully");
            resolve();
          }
        }
      );
    });
  });
}