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