import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { CATEGORY_COLORS } from "@/utils/constants";
import { formatCurrency } from "@/utils/currency";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg text-sm">
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export function CategoryBarChart({ data }) {
  const chartData = data.map((d) => ({
    category: d.category,
    total: d.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {chartData.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#6366f1"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
