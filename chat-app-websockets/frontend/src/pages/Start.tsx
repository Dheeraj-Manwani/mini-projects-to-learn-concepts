import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { lobbyCodeAtom, nameAtom } from "../recoil/atom";
import { useState } from "react";

export function StartPage() {
  const [name, setName] = useRecoilState(nameAtom);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeAtom);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!lobbyCode) {
      setError(true);
      return;
    }
    navigate("/chat");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md p-6 bg-white shadow-md rounded-md w-96">
        <h2 className="text-xl font-bold mb-4 text-black">Start Chat</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lobbyCode"
            className="block text-gray-700 font-semibold mb-2"
          >
            Lobby Code
          </label>
          <input
            type="text"
            id="lobbyCode"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            placeholder="Enter lobby code"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
          />
          {error && (
            <span className="text-red-500">lobby code cannot be empty</span>
          )}
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={handleSubmit}
        >
          Let's Chat
        </button>
      </div>
    </div>
  );
}
