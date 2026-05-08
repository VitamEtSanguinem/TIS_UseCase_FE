import { API_BASE_URL } from "../config/api";

export const deleteReading = async (id: string) => {
  const res = await fetch(`${BASE_URL}/readings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

export const addReading = async (reading: any) => {
  const res = await fetch(`${BASE_URL}/readings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reading),
  });
  if (!res.ok) throw new Error("Add failed");
};

export const updateReading = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/readings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Update failed");
};