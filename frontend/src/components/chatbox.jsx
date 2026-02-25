import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost/socket");

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((m) => [...m, data]);
    });
  }, []);

  const send = () => {
    const data = { sender: "hiep", content: msg, room: "global" };
    socket.emit("send", data);
    setMsg("");
  };

  return (
    <div className="p-4">
      <div className="border h-64 overflow-y-scroll">
        {messages.map((m, i) => (
          <div key={i}><b>{m.sender}:</b> {m.content}</div>
        ))}
      </div>

      <input
        className="border p-2"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={send} className="bg-blue-500 text-white p-2 ml-2">
        Send
      </button>
    </div>
  );
}