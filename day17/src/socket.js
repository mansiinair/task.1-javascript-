// Import socket.io-client
import { io } from "socket.io-client";

// Connect to backend server
// Make sure your server (server.js) is running on port 5000
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // ensures stable connection
  reconnection: true,        // auto-reconnect if disconnected
  reconnectionAttempts: 5,   // retry 5 times
  reconnectionDelay: 1000,   // wait 1s before retry
});

// Export socket instance for use in other files
export default socket;
