import React from "react";
import { useCallback } from "react";

type AnyRecord = Record<string, any>;

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

interface Props {
  data: AnyRecord[];
  onSort?: (key: string) => void;
  sortConfig?: SortConfig;
}

const sortableColumns = ["meterId", "label", "type", "value"];

const RenderTable: React.FC<Props> = ({ data, onSort, sortConfig }: Props) => {
  const getColumns = useCallback(
    (rows: AnyRecord[]) => {
      const keys = new Set<string>();
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => keys.add(key));
      });
      return Array.from(keys);
    },
    [data],
  );

  const renderValue = useCallback((value: any): React.ReactNode => {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
      return (
        <span style={{ whiteSpace: "nowrap" }}>
          {JSON.stringify(value, null, 2)}
        </span>
      );
    }

    return String(value);
  }, []);

  if (!data.length) return <div>No data</div>;

  const columns = getColumns(data);

  return (
    <div style={{ fontSize: "0.85rem", width: "auto" }}>
      <table>
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
                  <div>
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
          {data.map((row, meterId) => (
            <tr key={meterId}>
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
