import { useParams } from "react-router-dom";
import { useDBReader } from "../hooks/useDBReader";
import type { Reading, Meter } from "../types/types";
import { getReadingScore } from "../utils/dateScore";
import { computeConsumptionStats } from "../utils/consumption";
import { useReadingMutations } from "../hooks/useMutations";
import { validateAddReading, confirmDelete } from "../utils/readingRules";
import { useState } from "react";
import { getNextMonthYear } from "../utils/dateHelper";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MeterDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: readings = [],
    isPending,
    error,
  } = useDBReader<Reading>(`${BASE_URL}/readings`);

  const { data: meters = [] } = useDBReader<Meter>(`${BASE_URL}/meters`);

  const { deleteReading, addReading } = useReadingMutations();

  const meter = meters.find((m) => m.id === id);
  const unit = meter?.unit ?? "";

  const [draft, setDraft] = useState<null | { value: string }>(null);
  const [addError, setAddError] = useState("");

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const filtered = readings
    .filter((r) => r.meterId === id)
    .sort((a, b) => getReadingScore(b) - getReadingScore(a));

  const latest = filtered[0];
  const next = latest ? getNextMonthYear(latest.month, latest.year) : null;

  const { max, min, avg } = computeConsumptionStats(filtered);

  const handleStartAdd = () => {
    setDraft({ value: "" });
  };

  const handleSaveDraft = () => {
    if (!draft || !latest || !next) return;

    const value = Number(draft.value);

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

    setDraft(null);
    setAddError("");
  };

  const handleDelete = (readingId: any) => {
    if (!confirmDelete("this reading")) return;
    deleteReading(readingId);
  };

  return (
    <div>
      <h2>Meter ID: {id}</h2>

      <div>
        <h5>Consumption Insights</h5>

        {avg === null ? (
          <p>Not enough data</p>
        ) : (
          <>
            <p>
              <strong>Average consumption:</strong> {avg.toFixed(2)} {unit}
            </p>

            <p>
              <strong>Highest consumption:</strong> {max!.consumption} {unit} (
              {max!.month} {max!.year})
            </p>

            <p>
              <strong>Lowest consumption:</strong> {min!.consumption} {unit} (
              {min!.month} {min!.year})
            </p>
          </>
        )}
      </div>

      <button onClick={handleStartAdd}>Add Reading</button>

      {filtered.length === 0 ? (
        <p>No readings found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Month</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {draft && next && (
              <tr>
                <td>{next.year}</td>
                <td>{next.month}</td>

                <td>
                  <input
                    type="number"
                    value={draft.value}
                    onChange={(e) => setDraft({ value: e.target.value })}
                  />
                  {addError && <div style={{ color: "red" }}>{addError}</div>}
                </td>

                <td>{unit}</td>

                <td>
                  <button onClick={handleSaveDraft}>Save</button>
                  <button onClick={() => setDraft(null)}>Cancel</button>
                </td>
              </tr>
            )}

            {filtered.map((r, index) => (
              <tr key={r.id}>
                <td>{r.year}</td>
                <td>{r.month}</td>
                <td>{r.value}</td>
                <td>{unit}</td>

                <td>
                  {index === 0 && (
                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
