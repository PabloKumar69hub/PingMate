import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js"; 
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// 🔥 Allowed Origins (Local + Production)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://pingmate.vercel.app"
];

// ================= SOCKET.IO =================
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Store Online users
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ================= MIDDLEWARE =================

app.use(express.json({ limit: "4mb" }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  })
);

// REMOVE old app.options(/.*/, cors());
// Vercel handles preflight automatically

// ================= ROUTES =================

app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ================= DATABASE =================

await connectDB();

// ================= LOCAL DEV ONLY =================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log("Server is running on PORT:", PORT)
  );
}

// Export for Vercel
export default server;
