const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 5000;
const HOST = '0.0.0.0';

server.on('listening', () => {
  const address = server.address();
  console.log(`🔌 UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  console.log(`📨 Message from ${remote.address}:${remote.port} - ${message.toString()}`);
});

server.bind(PORT, HOST);
