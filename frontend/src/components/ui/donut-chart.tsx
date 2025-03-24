import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Tailwind-like color palette
const COLORS = [
  '#4F46E5', // indigo
  '#60A5FA', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#10B981', // emerald
  '#34D399', // green
  '#F59E0B', // amber
  '#EF4444'  // red
];

interface ChartData {
  name: string;
  value: number;
}

interface DonutChartProps {
  title: string;
  data: ChartData[];
  totalCount: number;
}

interface LegendProps {
  payload?: {
    value: string;
    color: string;
    payload: {
      value: number;
    };
  }[];
}

const CustomLegend = ({ payload = [] }: LegendProps) => {
  return (
    <ul className="list-none m-0 p-0">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="text-sm">
          <span style={{ color: entry.color }}>{entry.value} ({entry.payload.value})</span>
        </li>
      ))}
    </ul>
  );
};

export function DonutChart({ title, data, totalCount }: DonutChartProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="px-6 pt-4">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="35%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} items`, 'Count']}
              />
              <Legend 
                content={<CustomLegend />}
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 'auto',
                  padding: 0
                }}
              />
              <text
                x="35%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fill: '#000000'
                }}
              >
                {totalCount}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 