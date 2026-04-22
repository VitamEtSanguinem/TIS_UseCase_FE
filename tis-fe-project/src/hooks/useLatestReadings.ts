import { useMemo } from "react";
import { useDBReader } from "./useDBReader";
import type { Reading } from "../types/types";

const monthMap: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4,
  MAY: 5, JUN: 6, JUL: 7, AUG: 8,
  SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};



const getScore = (item: Reading) => {
  const month = monthMap[item.month.trim().toUpperCase()] ?? 0;
  return item.year * 100 + month;
};

export const useLatestReadings = (endpoint: string) => {
  const { data = [], isPending, error } = useDBReader<Reading>(endpoint);

  

  const latest = useMemo(() => {
    const latestByMeter = new Map<string, Reading>();

    for (const item of data) {
      const key = item.meterId;
      const score = getScore(item);
      const current = latestByMeter.get(key);

      if (!current || score > getScore(current)) {
        latestByMeter.set(key, item);
      }
    }

    return Array.from(latestByMeter.values());
  }, [data]);

  return { data: latest, isPending, error };
};