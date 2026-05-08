import { useParams } from "react-router-dom";
import { useDBReader } from "../hooks/useDBReader";
import type { Reading, Meter } from "../types/types";
import { getReadingScore } from "../utils/dateScore";
import { computeConsumptionStats } from "../utils/consumption";
import { useReadingMutations } from "../hooks/useMutations";
import {
  validateAddReading,
  confirmDelete,
  validateEditReading,
} from "../utils/readingRules";
import { getNextMonthYear } from "../utils/dateHelper";
import { useState } from "react";
import { Table, Input, Button, Typography, Card, Space, message, Row, Col, Statistic } from "antd";
import PageLayout from "../components/PageLayout";
import { BASE_URL } from "../config/api";


export default function MeterDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: readings = [],
    isPending,
    error,
  } = useDBReader<Reading>(`${BASE_URL}/readings`);

  const { data: meters = [] } = useDBReader<Meter>(`${BASE_URL}/meters`);

  const { deleteReading, addReading, updateReading } = useReadingMutations();

  const meter = meters.find((m) => m.id === id);
  const unit = meter?.unit ?? "";

  const [draftValue, setDraftValue] = useState("");
  const [addError, setAddError] = useState("");

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const filtered = readings
    .filter((r) => r.meterId === id)
    .sort((a, b) => getReadingScore(b) - getReadingScore(a));

  const latest = filtered[0];
  const next = latest ? getNextMonthYear(latest.month, latest.year) : null;

  const { max, min, avg } = computeConsumptionStats(filtered);

  const handleAdd = () => {
    if (!latest || !next) return;

    const value = Number(draftValue);

    const error = validateAddReading(latest.value, value);
    if (error) {
      setAddError(error);
      return;
    }

    addReading({
      meterId: id!,
      month: next.month,
      year: next.year,
      value,
    });

    setDraftValue("");
    setAddError("");
  };

  const handleDelete = (readingId: string) => {
    if (!confirmDelete("this reading")) return;
    deleteReading(readingId);
    message.success("Reading deleted");
  };

  const handleEditSave = (r: Reading, index: number) => {
    const newValue = Number(editValues[r.id] ?? r.value);

    const error = validateEditReading(filtered, index, newValue);

    if (error) {
      setEditErrors((prev) => ({ ...prev, [r.id]: error }));
      return;
    }

    updateReading({
      id: r.id,
      data: { value: newValue },
    });

    setEditingRow(null);
    message.success("Updated successfully");
  };

  const columns = [
    { title: "Year", dataIndex: "year" },
    { title: "Month", dataIndex: "month" },

    {
      title: "Value",
      dataIndex: "value",
      render: (_: any, r: Reading) => {
        const isEditing = editingRow === r.id;

        return isEditing ? (
          <Space direction="vertical">
            <Input
              type="number"
              value={editValues[r.id] ?? r.value}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [r.id]: e.target.value,
                }))
              }
            />
            {editErrors[r.id] && (
              <Typography.Text type="danger">
                {editErrors[r.id]}
              </Typography.Text>
            )}
          </Space>
        ) : (
          r.value
        );
      },
    },

    { title: "Unit", render: () => unit },

    {
      title: "Actions",
      render: (_: any, r: Reading, index: number) => {
        const isEditing = editingRow === r.id;

        return (
          <Space>
            {isEditing ? (
              <>
                <Button type="primary" onClick={() => handleEditSave(r, index)}>
                  Save
                </Button>

                <Button onClick={() => setEditingRow(null)}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditingRow(r.id)}>Edit</Button>
            )}

            {index === 0 && (
              <Button danger onClick={() => handleDelete(r.id)}>
                Delete
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageLayout>
      <div>
        <h1>Meter ID: {id}</h1>

        <Card style={{ marginBottom: 16 }} className="glow-card">
          <h2>Consumption Insights</h2>

          {avg === null ? (
            <p>Not enough data</p>
          ) : (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Average" value={avg.toFixed(4)} suffix={unit} />
                </Col>
                <Col span={8}>
                  <Statistic title="Max" value={max?.consumption} suffix={unit} />
                </Col>
                <Col span={8}>
                  <Statistic title="Min" value={min?.consumption} suffix={unit} />
                </Col>
              </Row>
            </>
          )}
        </Card>

        <Card style={{ marginBottom: 16 }} className="glow-card">
          <Space>
            <Input
              type="number"
              placeholder="New reading value"
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
            />

            <Button type="primary" onClick={handleAdd}>
              Add Reading
            </Button>
          </Space>

          {addError && (
            <Typography.Text type="danger">{addError}</Typography.Text>
          )}
        </Card>
        <Card style={{ marginBottom: 16 }} className="glow-card">
          <Table
            dataSource={filtered}
            rowKey="id"
            pagination={false}
            columns={columns}
            scroll={{ y: 450 }}
          />
        </Card>
      </div>

    </PageLayout>
  );
}
