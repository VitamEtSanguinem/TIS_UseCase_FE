import { Layout, ConfigProvider, theme } from "antd";

const { Content } = Layout;

export default function PageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
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
        </ConfigProvider>
    );
}