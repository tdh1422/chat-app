import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/socket", {
  transports: ["websocket"],
});

import { useEffect } from "react";
import socket from "../socket";

function ChatPage({ user }) {

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

  return (
    <div>
      Chat Page
    </div>
  );
}

export default ChatPage;