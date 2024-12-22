"use client";
import React, { useEffect, useState } from "react";
import ChatForm from "./_components/ChatForm";
import ChatMessage from "./_components/ChatMessage";
import { socket } from "@/lib/socketClient";

export default function Chatroom() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    socket.on("message", (data) => {
      //console.log("data", data);

      setMessages((prevData) => [...prevData, data]);
    });

    socket.on("user_joined", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "system", message },
      ]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  const handleSendMessage = (message: string) => {
    const data = {
      roomId,
      message,
      sender: userName,
    };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", { roomId, message, sender: userName });

    console.log("Mensaje enviado:", message);
  };

  const handleJoinRoom = () => {
    if (roomId && userName) {
      socket.emit("join-room", { roomId, userName });
      setJoined(true);
    }
  };

  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex flex-col gap-2 mt-4">
          <input
            type="text"
            placeholder="Escribe tu nombre de usuario"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Escribe el nombre del Chat"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 rounded-lg bg-blue-500"
          >
            Unirse a la sala
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl mx-auto">
          <h1 className="mb-4 text-3xl font-bold">Chatroom {roomId}</h1>
          <div className="h-[500px] overflow-y-auto p-4  mb-4 bg-gray-200 border-2 rounded-lg">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
