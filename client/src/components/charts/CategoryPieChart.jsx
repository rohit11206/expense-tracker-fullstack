import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORY_COLORS } from "@/utils/constants";
import { formatCurrency } from "@/utils/currency";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg text-sm">
      <p className="font-semibold">{d.name}</p>
      <p className="text-muted-foreground">{formatCurrency(d.value)}</p>
      <p className="text-muted-foreground">{d.payload.percent}%</p>
    </div>
  );
};

export function CategoryPieChart({ data }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  const chartData = data.map((d) => ({
    name: d.category,
    value: d.total,
    percent: total > 0 ? ((d.total / total) * 100).toFixed(1) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] || "#94a3b8"}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
