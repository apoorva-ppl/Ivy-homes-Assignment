"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BhkDatum {
  bhk?: number | string;
  bedroom?: number | string;
  count?: number;
  [k: string]: unknown;
}

const COLORS = ["#2F6B4F", "#84A990", "#B5563C", "#E8E3D5", "#5C8B6E", "#1D4633"];

export function BhkPieChart({ data }: { data: BhkDatum[] }) {
  const chartData = data.map((d) => ({
    name: `${d.bhk ?? d.bedroom ?? "—"} BHK`,
    value: d.count ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E1DED3", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
