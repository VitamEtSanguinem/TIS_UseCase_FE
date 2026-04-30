import type { Reading } from "../types/types";
import { getReadingScore } from "./dateScore";

export type ConsumptionEntry = {
  year: number;
  month: string;
  consumption: number;
};

export type ConsumptionStats = {
  entries: ConsumptionEntry[];
  max: ConsumptionEntry | null;
  min: ConsumptionEntry | null;
  avg: number | null;
};

export const computeConsumptionStats = (
  readings: Reading[]
): ConsumptionStats => {

  const sorted = [...readings].sort(
    (a, b) => getReadingScore(b) - getReadingScore(a)
  );

  const entries: ConsumptionEntry[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const previous = sorted[i + 1];

    entries.push({
      year: current.year,
      month: current.month,
      consumption: current.value - previous.value,
    });
  }

  if (entries.length === 0) {
    return { entries, max: null, min: null, avg: null };
  }

  const max = entries.reduce((a, b) =>
    b.consumption > a.consumption ? b : a
  );

  const min = entries.reduce((a, b) =>
    b.consumption < a.consumption ? b : a
  );

  const total = entries.reduce((sum, e) => sum + e.consumption, 0);
  const avg = total / entries.length;

  return { entries, max, min, avg };
};