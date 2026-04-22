import { useParams } from "react-router-dom";
import { useDBReader } from "../hooks/useDBReader";
import type { Reading } from "../types/types";
import { getReadingScore } from "../utils/dateScore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MeterDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: readings = [],
    isPending,
    error,
  } = useDBReader<Reading>(`${BASE_URL}/readings`);

  if (isPending) return <p className="mt-4 text-center">Loading...</p>;
  if (error) return <p className="mt-4 text-center">Error loading data</p>;

  const filtered = readings
    .filter((r) => r.meterId === id)
    .sort((a, b) => getReadingScore(b) - getReadingScore(a));

  return (
    <div>
      <h2>Meter ID: {id}</h2>

      {filtered.length === 0 ? (
        <p>No readings found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Month</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.year}</td>
                <td>{r.month}</td>
                <td>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
