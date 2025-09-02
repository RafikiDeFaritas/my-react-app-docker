import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12 }}>
        <Link to="/">Home</Link>{" | "}
        <Link to="/register">Register</Link>{" | "}
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>Accueil</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
