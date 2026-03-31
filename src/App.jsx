import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Details from "./Pages/Details/Details";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<Details />} />
    </Routes>
  );
}

export default App;