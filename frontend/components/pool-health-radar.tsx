'use client';

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PoolHealthRadarProps {
  data: Array<{
    category: string;
    value: number;
    fullMark: number;
  }>;
  brandColor?: string;
  title?: string;
}

export function PoolHealthRadar({
  data,
  brandColor = '#44e6ff',
  title = 'Pool Health Status',
}: PoolHealthRadarProps) {
  return (
    <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-cyan-400 text-sm font-mono tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke={`${brandColor}40`} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: brandColor, fontSize: 11 }}
              stroke={brandColor}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'dataMax']}
              tick={{ fill: brandColor, fontSize: 10 }}
              stroke={`${brandColor}60`}
            />
            <Radar
              name="Health"
              dataKey="value"
              stroke={brandColor}
              fill={brandColor}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend wrapperStyle={{ color: brandColor }} iconType="circle" />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
