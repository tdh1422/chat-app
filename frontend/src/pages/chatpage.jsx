import { useEffect } from "react";
import socket from "../socket";

export default function ChatPage({ user }) {
  useEffect(() => {
    if (!user) return;

    socket.emit("setup", user);

    socket.on("connected", () => {
      console.log("User joined socket room");
    });

    return () => {
      socket.off("connected");
    };
  }, [user]);

  return <div>Chat Page</div>;
}
