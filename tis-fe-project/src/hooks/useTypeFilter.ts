import { useMemo, useState } from "react";

export function useTypeFilter<T extends { type?: string }>(data: T[]) {
  const [typeFilter, setTypeFilter] = useState<string>("both");

  const filteredData = useMemo(() => {

    if (typeFilter === "both") {
      return data.filter(
        (item) =>
          item.type === "electricity" || item.type === "gas"
      );
    }

    return data.filter((item) => item.type === typeFilter);
  }, [data, typeFilter]);

  return {
    filteredData,
    typeFilter,
    setTypeFilter,
  };
}