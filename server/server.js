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

// ✅ Initialize socket.io server (FIXED)
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Store Online users
export const userSocketMap = {}; // { userid : socketid }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));

app.use(
  cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"] // ✅ ADD token
  })
);


// ✅ FIX: Express 5 compatible preflight handler
app.options(/.*/, cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect MongoDB
await connectDB();
if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log("Server is running on PORT:", PORT)
);
}

// Export sever for Vercel
export default server;
