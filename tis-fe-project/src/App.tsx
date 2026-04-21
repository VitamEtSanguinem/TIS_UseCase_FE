import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MetersPage from "./pages/Meters";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">
          TIS Frontend Use Case
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/meters">
            Meters
          </Link>
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meters" element={<MetersPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
