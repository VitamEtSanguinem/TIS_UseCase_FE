import { Layout } from "antd";

const { Content } = Layout;

export default function PageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Layout style={{ minHeight: "100vh", background: "#1d1e20" }}>
            <Content
                style={{
                    padding: "32px 24px",
                    maxWidth: 1100,
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                {children}
            </Content>
        </Layout>

    );
}