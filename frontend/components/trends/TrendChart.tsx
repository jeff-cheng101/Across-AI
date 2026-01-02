'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendChartProps {
  title: string;
  data: Record<string, unknown>[];
  dataKeys: { key: string; color: string; name: string }[];
  type?: 'line' | 'area';
  height?: number;
}

export function TrendChart({
  title,
  data,
  dataKeys,
  type = 'line',
  height = 300,
}: TrendChartProps) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {dataKeys.map((key) =>
              type === 'area' ? (
                <Area
                  key={key.key}
                  type="monotone"
                  dataKey={key.key}
                  stroke={key.color}
                  fill={key.color}
                  fillOpacity={0.3}
                  name={key.name}
                />
              ) : (
                <Line
                  key={key.key}
                  type="monotone"
                  dataKey={key.key}
                  stroke={key.color}
                  strokeWidth={2}
                  name={key.name}
                />
              ),
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
