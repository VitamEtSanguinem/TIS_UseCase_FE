import { BrowserRouter, Routes, Route } from "react-router-dom";
import MetersPage from "./pages/Meters";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MeterDetails from "./pages/MeterDetails";
import { Layout } from "antd";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { ConfigProvider, theme } from "antd";

function App() {
  const [darkMode] = useState(true);
  return (
    <BrowserRouter>
      <div>
        <Layout>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meters" element={<MetersPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meters/:id" element={<MeterDetails />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
