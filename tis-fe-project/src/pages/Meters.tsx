import { useLatestReadings } from "../hooks/useLatestReadings";
import { useDBReader } from "../hooks/useDBReader";
import type { Meter } from "../types/types";
import {
  Table, Card, Layout, Typography
} from "antd";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { BASE_URL } from "../services/readingsApi";


export default function MetersPage() {
  const { data: meters = [] } = useDBReader<Meter>(`${BASE_URL}/meters`);

  const { data: readings = [] } = useLatestReadings(`${BASE_URL}/readings`);

  const { Content } = Layout;
  const { Title } = Typography;

  const metersSafe = meters ?? [];
  const readingsSafe = readings ?? [];

  const merged = metersSafe.map((meter) => {
    const reading = readingsSafe.find((r) => r.meterId === meter.id);

    return {
      meterId: meter.id,
      label: meter.label,
      location: meter.location,
      type: meter.type,
      value: reading?.value,
      unit: meter.unit,
    };
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "meterId",
      sorter: (a, b) => a.meterId.localeCompare(b.meterId),
      render: (id) => <Link to={`/meters/${id}`}>{id}</Link>,
    },
    {
      title: "Label",
      dataIndex: "label",
      sorter: (a, b) => a.label.localeCompare(b.label),
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (loc) => (loc ? `${loc.lat}, ${loc.lon}` : "-"),
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: [
        { text: "Both", value: "both" },
        { text: "Electricity", value: "electricity" },
        { text: "Gas", value: "gas" },
      ],
      onFilter: (value, record) => {
        if (value === "both") {
          return record.type === "electricity" || record.type === "gas";
        }

        return record.type === value;
      },
    },
    {
      title: "Latest Reading",
      dataIndex: "value",
      sorter: (a, b) => a.value - b.value,
    },

    {
      title: "Unit",
      dataIndex: "unit",
    },
  ];

  return (
    <PageLayout>
      <Content
        style={{
          padding: "24px",

          margin: "0 auto",
        }}
      >
        <Title level={3} style={{ marginBottom: 16 }} className="gradient-text">
          Meters
        </Title>

        <Card className="glow-card">
          <Table
            dataSource={merged}
            columns={columns}
            rowKey="meterId"
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: ["5", "10", "20"],
              showSizeChanger: true,
            }}
            scroll={{
              x: "max-content",
              y: 350
            }}
          />
        </Card>
      </Content>
    </PageLayout>
  );
}
