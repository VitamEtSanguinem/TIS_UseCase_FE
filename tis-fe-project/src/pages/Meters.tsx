import RenderTable from "../components/RenderTable";
import { useLatestReadings } from "../hooks/useLatestReadings";
import { useDBReader } from "../hooks/useDBReader";
import { useState } from "react";
import Pagination from "../components/Pagination";
import { useSort } from "../hooks/useSort";
import { useTypeFilter } from "../hooks/useTypeFilter";

export default function MetersPage() {
  const { data: meters } = useDBReader("http://localhost:3000/meters");
  const { data: readings } = useLatestReadings(
    "http://localhost:3000/readings",
  );

  const merged = meters.map((meter) => {
    const reading = readings.find((r) => r.meterId === meter.id);

    return {
      meterId: meter.id,
      label: meter.label,
      location: meter.location,
      type: meter.type,
      value: reading?.value,
      unit: meter.unit,
    };
  });

  const { filteredData, typeFilter, setTypeFilter } = useTypeFilter(merged);
  const { sortedData, requestSort, sortConfig } = useSort(filteredData);

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSizeOptions = [5, 10, 20];

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginated = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="container mt-4">
      <select
        className="form-select form-select-sm w-auto"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="both">Both</option>
        <option value="electricity">Electricity</option>
        <option value="gas">Gas</option>
      </select>
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: "900px", width: "100%" }}>
          <RenderTable
            data={paginated}
            onSort={requestSort}
            sortConfig={sortConfig}
          />
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
