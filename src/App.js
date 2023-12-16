import "./App.css";
import "./Masood.css";
import "./Saaram.css";
import "./Adnan.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateRoom from "./comp/Masood/CreateRoom";
import Room from "./comp/Masood/Room";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateRoom />} />
          <Route path="/room/:roomID" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
