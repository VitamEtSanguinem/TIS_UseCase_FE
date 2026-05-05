import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

export default function Navbar() {
  const location = useLocation();

  return (
    <Header
      style={{
        background: "#000000", // darker than page
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ color: "white", marginRight: 20 }}>TIS FE Use Case</div>

      <Menu

        className="custom-menu"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={[
          {
            key: "/",
            label: <Link to="/">Home</Link>,
          },
          {
            key: "/dashboard",
            label: <Link to="/dashboard">Dashboard</Link>,
          },
          {
            key: "/meters",
            label: <Link to="/meters">Meters</Link>,
          },
        ]}
        style={{ flex: 1 }}
      />
    </Header>
  );
}
