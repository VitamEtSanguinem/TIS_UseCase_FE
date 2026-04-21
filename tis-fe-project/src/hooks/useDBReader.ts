import { useEffect, useState } from "react";

type AnyRecord = Record<string, any>;

export const useDBReader = (endpoint: string) => {
  const [data, setData] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();
        const normalized = Array.isArray(json) ? json : [json];


        setData(normalized);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};