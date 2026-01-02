import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Metric {
  label: string;
  current: number | string;
  previous: number | string;
  change: number;
  unit?: string;
}

interface ComparisonViewProps {
  title: string;
  metrics: Metric[];
}

export function ComparisonView({ title, metrics }: ComparisonViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, _index) => (
            <div
              key={metric.label}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {metric.current}
                    {metric.unit}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    vs {metric.previous}
                    {metric.unit}
                  </span>
                </div>
              </div>
              <Badge
                variant={metric.change > 0 ? 'destructive' : 'default'}
                className="flex items-center gap-1"
              >
                {metric.change > 0 ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                {Math.abs(metric.change)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
