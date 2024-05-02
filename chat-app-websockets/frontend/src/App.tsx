import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StartPage } from "./pages/Start";
import { Chat } from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
