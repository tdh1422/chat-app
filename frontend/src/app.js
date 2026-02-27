import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/socket", {
  transports: ["websocket"],
});

export default function App() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (m) => setChat((c) => [...c, m]));
  }, []);

  const send = () => {
    socket.emit("sendMessage", msg);
    setMsg("");
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Chat App</h1>
      <div className="border p-2 h-60 overflow-y-scroll">
        {chat.map((m, i) => <p key={i}>{m}</p>)}
      </div>
      <input className="border p-2 w-full" value={msg} onChange={e=>setMsg(e.target.value)} />
      <button onClick={send} className="bg-blue-500 text-white p-2 mt-2">Send</button>
    </div>
  );
}
