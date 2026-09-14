"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface LocalityDatum {
  locality: string;
  count?: number;
  median_price?: number;
  [k: string]: unknown;
}

export function LocalityBarChart({ data }: { data: LocalityDatum[] }) {
  const chartData = data
    .slice(0, 10)
    .map((d) => ({
      locality: d.locality,
      value: (d.count as number) ?? (d.median_price as number) ?? 0,
    }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E1DED3" vertical={false} />
        <XAxis
          dataKey="locality"
          tick={{ fontSize: 11, fill: "#6E7268" }}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis tick={{ fontSize: 11, fill: "#6E7268" }} width={40} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E1DED3", fontSize: 12 }} />
        <Bar dataKey="value" fill="#2F6B4F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
