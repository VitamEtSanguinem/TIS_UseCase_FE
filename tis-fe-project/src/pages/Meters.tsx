import { useLatestReadings } from "../hooks/useLatestReadings";
import { useDBReader } from "../hooks/useDBReader";
import type { Meter } from "../types/types";
import { Table } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MetersPage() {
  const { data: meters = [] } = useDBReader<Meter>(`${BASE_URL}/meters`);

  const { data: readings = [] } = useLatestReadings(`${BASE_URL}/readings`);

  const metersSafe = meters ?? [];
  const readingsSafe = readings ?? [];

  const [pageSize, setPageSize] = useState(5);

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
    <div className="container mt-4">
      <div>
        <div style={{ maxWidth: "900px", width: "100%" }}>
          <Table
            dataSource={merged}
            columns={columns}
            rowKey="meterId"
            pagination={{
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              onShowSizeChange: (_, size) => {
                setPageSize(size);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
