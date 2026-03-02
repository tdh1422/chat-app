import { useEffect } from "react";
import socket from "../socket";

function ChatBox({ selectedChat }) {

  useEffect(() => {
    if (!selectedChat) return;

    socket.emit("join chat", selectedChat._id);

  }, [selectedChat]);

  useEffect(() => {

    socket.on("message received", (newMessage) => {
      console.log("New message:", newMessage);
    });

    return () => {
      socket.off("message received");
    };

  }, []);

  const sendMessage = () => {
    socket.emit("new message", {
      content: "hello",
      chatId: selectedChat._id,
    });
  };

  return (
    <div>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;