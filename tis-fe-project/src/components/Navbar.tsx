import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

export default function Navbar() {
  const location = useLocation();

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div style={{ color: "white", marginRight: 20 }}>TIS FE Use Case</div>

      <Menu
        theme="dark"
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
