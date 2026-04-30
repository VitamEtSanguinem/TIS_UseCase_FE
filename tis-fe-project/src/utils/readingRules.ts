import type { Reading } from "../types/types";
import { getReadingScore } from "./dateScore";

export const confirmDelete = (label = "this reading") => {
  return window.confirm(
    `Are you sure you want to delete ${label}?`
  );
};


export const validateAddReading = (
  latestValue: number,
  newValue: number
): string => {
  if (newValue < latestValue) {
    return "Value must be ≥ last reading";
  }

  return "";
};


export const validateEditReading = (
  readings: Reading[],
  index: number,
  newValue: number
): string => {
  const sorted = [...readings].sort(
    (a, b) => getReadingScore(b) - getReadingScore(a)
  );

  const prev = sorted[index + 1];
  const next = sorted[index - 1];

  if (prev && newValue < prev.value) {
    return "Must be ≥ previous month";
  }

  if (next && newValue > next.value) {
    return "Must be ≤ next month";
  }

  return "";
};