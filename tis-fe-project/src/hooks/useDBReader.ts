import {useQuery } from "@tanstack/react-query";



export const useDBReader = <T,>(endpoint: string) => {
  return useQuery<T[]>({
    queryKey: ["db", endpoint],
    queryFn: async (): Promise<T[]> => {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
  });
};