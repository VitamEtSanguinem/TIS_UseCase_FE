import type { Reading } from "../types/types";

const monthMap: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4,
  MAY: 5, JUN: 6, JUL: 7, AUG: 8,
  SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

export const getReadingScore = (r: Reading): number => {
  const month = monthMap[r.month.trim().toUpperCase()] ?? 0;
  return r.year * 100 + month;
};