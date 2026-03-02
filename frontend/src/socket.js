import { io } from "socket.io-client";

const URL = "http://localhost:5000"; // đổi theo backend bạn

const socket = io(URL, {
  autoConnect: false,   // không connect ngay
  withCredentials: true,
});

export default socket;