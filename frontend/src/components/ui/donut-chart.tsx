import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function DonutChart({ title, data, totalCount }: DonutChartProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="px-6 pt-4">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx={200}
                cy={150}
                innerRadius={70}
                outerRadius={100}
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
                layout="vertical"
                align="right"
                verticalAlign="top"
                wrapperStyle={{
                  top: 0,
                  right: 20,
                  width: 'auto',
                  padding: 0
                }}
                formatter={(value: string) => `${value} (${data.find(item => item.name === value)?.value || 0})`}
              />
              <text
                x={200}
                y={150}
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