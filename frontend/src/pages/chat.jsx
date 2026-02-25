import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (m) => setMessages(prev => [...prev, m]));
  }, []);

  const send = () => {
    socket.emit("sendMessage", msg);
    setMessages(prev => [...prev, "Me: " + msg]);
    setMsg("");
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">Users List</div>

      <div className="flex-1 flex flex-col">
        <div className="bg-blue-500 text-white p-3">Chat Room</div>

        <div className="flex-1 p-4 overflow-y-scroll bg-gray-100">
          {messages.map((m,i)=><div key={i} className="bg-white p-2 rounded mb-2 shadow">{m}</div>)}
        </div>

        <div className="p-2 flex border-t">
          <input className="flex-1 border p-2" value={msg} onChange={e=>setMsg(e.target.value)} />
          <button onClick={send} className="bg-blue-500 text-white px-4">Send</button>
        </div>
      </div>
    </div>
  );
}