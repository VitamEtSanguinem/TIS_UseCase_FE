import { BrowserRouter, Routes, Route } from "react-router-dom";
import MetersPage from "./pages/Meters";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MeterDetails from "./pages/MeterDetails";
import { ConfigProvider, Layout, theme } from "antd";
import Navbar from "./components/Navbar";


function App() {

  return (
    <BrowserRouter>
      <div>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorBgBase: "#0f1115",
              colorBgContainer: "#151821",
              borderRadius: 10,
            },
          }}
        >
          <Layout>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/meters" element={<MetersPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meters/:id" element={<MeterDetails />} />
            </Routes>
          </Layout>
        </ConfigProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
