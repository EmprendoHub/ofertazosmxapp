import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
// create a server
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // detect when user joins chatroom
    socket.on("join-room", ({ roomId, userName }) => {
      socket.join(roomId);
      console.log(`User ${userName} joined room: ${roomId}`);

      socket.to(roomId).emit("user_joined", `User ${userName} joined ChatRoom`);
    });

    socket.on("message", ({ roomId, message, sender }) => {
      console.log(`Message received: ${message} from ${sender} in ${roomId}`);

      socket.to(roomId).emit("message", { sender, message });
    });

    // detect whe user leaves chatoom
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
