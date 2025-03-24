import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  count: number;
}

export function StatsCard({ title, count }: StatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-3xl font-bold text-primary">{count}</p>
        </div>
      </CardContent>
    </Card>
  );
} 