import { useMemo } from "react";
import { useDBReader } from "./useDBReader";
import type { Reading } from "../types/types";
import { getReadingScore } from "../utils/dateScore";



export const useLatestReadings = (endpoint: string) => {
  const { data = [], isPending, error } = useDBReader<Reading>(endpoint);

  

  const latest = useMemo(() => {
    const latestByMeter = new Map<string, Reading>();

    for (const item of data) {
      const key = item.meterId;
      const score = getReadingScore(item);
      const current = latestByMeter.get(key);

      if (!current || score > getReadingScore(current)) {
        latestByMeter.set(key, item);
      }
    }

    return Array.from(latestByMeter.values());
  }, [data]);

  return { data: latest, isPending, error };
};