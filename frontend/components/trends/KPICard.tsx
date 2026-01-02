import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from 'lucide-react';
import type React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  subtitle?: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function KPICard({
  title,
  value,
  change,
  trend,
  icon,
  subtitle,
  description,
  variant = 'default',
}: KPICardProps) {
  const variantColors = {
    default: 'text-foreground',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  };

  const trendIcons = {
    up: <ArrowUpIcon className="w-4 h-4" />,
    down: <ArrowDownIcon className="w-4 h-4" />,
    stable: <TrendingUpIcon className="w-4 h-4" />,
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70">{subtitle}</p>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${variantColors[variant]}`}>
          {value}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend && trendIcons[trend]}
            <span
              className={`text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}
            >
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            {description && (
              <span className="text-sm text-muted-foreground ml-2">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
