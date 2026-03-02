import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ChatPage from "./pages/chatpage";

import { useEffect } from "react";
import socket from "./socket";

export default function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}