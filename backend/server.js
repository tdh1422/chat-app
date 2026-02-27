require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const Message = require("./models/message");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authSocket = require("./socket/authSocket");

const app = express();
const server = http.createServer(app);

// ===== Middleware =====
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// ===== DB =====
connectDB();

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.get("/", (_, res) => res.send("Backend OK"));

// ===== Socket.IO =====
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true
  }
});

// auth middleware cho socket
io.use(authSocket);

// Redis pub/sub
const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

sub.subscribe("chat");

sub.on("message", (_, msg) => {
  const data = JSON.parse(msg);
  io.to(data.room).emit("message", data);
});

// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("send", async (data) => {
    try {
      const msg = await Message.create({
        sender: socket.user.id,
        content: data.content,
        room: data.room
      });
    
      pub.publish("chat", JSON.stringify(msg));
    } catch (err) {
      console.error("Save message error:", err);
    }
  });
});

// ===== LISTEN 1 LẦN DUY NHẤT =====
server.listen(process.env.PORT || 5000, () => {
  console.log("Backend + Socket running on 5000");
});