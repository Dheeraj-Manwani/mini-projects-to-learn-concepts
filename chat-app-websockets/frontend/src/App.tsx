import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://your_ip:8080");
    newSocket.onopen = () => {
      console.log("Connection established");
      // newSocket.send("Hello Server!");
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
      JSON.stringify({ sender: localStorage.getItem("name"), text: newMessage })
    );
    const updatedMessages = [
      ...messages,
      { sender: localStorage.getItem("name") || "Anonymous", text: newMessage },
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
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <div className="w-2/3 h-3/5 bg-white border border-gray-300 rounded-lg overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex justify-between mb-2 ${
              message.sender === localStorage.getItem("name")
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <div className="max-w-md px-3 rounded-lg shadow bg-blue-500 text-white">
              <div className="text-[10px] pt-1 translate-y-1">
                {message.sender === localStorage.getItem("name")
                  ? "You"
                  : message.sender}
              </div>
              <div className="pb-1.5">{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-2/3 mt-4">
        <input
          type="text"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
