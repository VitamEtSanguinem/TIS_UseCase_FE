export type Meter = {
  id: string;
  label: string;
  location: {
    lat: number;
    lon: number;
  };
  type: string;
  unit: "kWh" | "m3"
};

export type Reading = {
  id: number;
  meterId: string;
  month:string;
  year:number;
  value: number;
};