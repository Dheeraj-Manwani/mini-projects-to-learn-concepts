import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { lobbyCodeAtom, nameAtom } from "../recoil/atom";
import { Link } from "react-router-dom";

export function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const name = useRecoilValue(nameAtom);
  const lobbyCode = useRecoilValue(lobbyCodeAtom);

  if (!lobbyCode) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-900">
        <div>
          enter a lobby code in start page to chat
          <Link to="/" className="text-blue-500 underline pl-3">
            Start Page
          </Link>
        </div>
      </div>
    );
  } else {
    useEffect(() => {
      const newSocket = new WebSocket(
        `ws://localhost:8080/?lobby=${lobbyCode}`
      );
      newSocket.onopen = () => {
        console.log("Connection established");
      };
      setSocket(newSocket);
      return () => newSocket.close();
    }, []);

    if (!localStorage.getItem("name")) {
      let val = prompt("Enter your name to proceed to the chat");
      if (!val) val = "Anonymous";
      localStorage.setItem("name", val);
    }

    if (socket) {
      socket.onmessage = (message) => {
        console.log("Message received:", message.data);
        messageRecieved(message.data);
      };
    }

    const sendMessage = () => {
      if (newMessage.trim() === "") return;
      socket?.send(
        JSON.stringify({
          sender: name,
          text: newMessage,
        })
      );
      const updatedMessages = [
        ...messages,
        {
          sender: name || "Anonymous",
          text: newMessage,
        },
      ];
      setMessages(updatedMessages);
      setNewMessage("");
    };

    const messageRecieved = (data: string) => {
      const jsonData = JSON.parse(data);
      setMessages([...messages, jsonData]);
      console.log(messages);
    };

    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-900">
        <div className="flex justify-end pb-2">
          <div className="text-white px-5">
            User Name = {name ? name : "Unknown"}
          </div>
          <div className="text-white">Lobby Code = {lobbyCode}</div>
        </div>
        <div className="w-2/3 h-3/5 bg-gray-300 border border-gray-300 rounded-lg overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex justify-between mb-2 ${
                message.sender === name ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="max-w-md px-3 rounded-lg shadow bg-blue-500 text-white">
                <div className="text-[10px] pt-1 translate-y-1">
                  {message.sender === name ? "You" : message.sender}
                </div>
                <div className="pb-1.5">{message.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 mt-4 flex gap-3">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}
