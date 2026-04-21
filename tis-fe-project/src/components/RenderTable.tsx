import React from "react";
import "bootstrap/dist/css/bootstrap.css";

type AnyRecord = Record<string, any>;

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

interface Props {
  data: AnyRecord[];
  onSort?: (key: string) => void; // optional = safer
  sortConfig?: SortConfig;
}

const RenderTable: React.FC<Props> = ({ data, onSort, sortConfig }: Props) => {
  const getColumns = (rows: AnyRecord[]) => {
    const keys = new Set<string>();
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => keys.add(key));
    });
    return Array.from(keys);
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
      return (
        <span style={{ whiteSpace: "nowrap" }}>
          {JSON.stringify(value, null, 2)}
        </span>
      );
    }

    return String(value);
  };

  if (!data.length) return <div>No data</div>;

  const columns = getColumns(data);
  const sortableColumns = ["meterId", "label", "type", "value"];

  return (
    <div
      className="container mt-4"
      style={{ fontSize: "0.85rem", width: "auto" }}
    >
      <table className="table table-hover table-dark table-bordered text-center align-middle">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSortable = sortableColumns.includes(col);
              const isActive = sortConfig?.key === col;

              return (
                <th
                  key={col}
                  onClick={() => isSortable && onSort?.(col)}
                  style={{
                    cursor: isSortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    opacity: isSortable ? 1 : 0.6,
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center gap-1">
                    {col}

                    {isSortable && (
                      <span>
                        {isActive
                          ? sortConfig?.direction === "asc"
                            ? "▲"
                            : "▼"
                          : "⇅"}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>{renderValue(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenderTable;
