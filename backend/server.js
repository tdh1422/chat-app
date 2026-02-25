require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Import file kết nối database
const connectDB = require("./config/db");

// Gọi hàm kết nối database
connectDB();

// Đoạn này không cần nữa nếu đã dùng connectDB
// mongoose.connect(process.env.MONGO_URI);

// Định nghĩa các route
app.use("/api/auth", require("./routes/auth"));

app.get("/", (_, res) => res.send("Backend OK"));

app.listen(5000, () => console.log("Backend running on 5000"));

const { Server } = require("socket.io");
const Redis = require("ioredis");

const io = new Server(3001, { cors: { origin: "*" } });

const pub = new Redis("redis://redis:6379");
const sub = new Redis("redis://redis:6379");

sub.subscribe("chat");

sub.on("message", (_, msg) => {
  io.emit("message", JSON.parse(msg));
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send", (data) => {
    pub.publish("chat", JSON.stringify(data));
  });
});