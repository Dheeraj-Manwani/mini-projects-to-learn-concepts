import "./App.css";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Card } from "./components/Card";

function App() {
  return (
    <div className="w-full">
      <Navbar />
      <Hero />
      <div className="flex gap-1">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

export default App;
