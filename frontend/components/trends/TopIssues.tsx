import { AlertTriangleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Issue {
  name: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
  change: number;
}

interface TopIssuesProps {
  title: string;
  issues: Issue[];
}

export function TopIssues({ title, issues }: TopIssuesProps) {
  const severityColors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangleIcon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, _index) => (
            <div
              key={issue.name}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Badge className={severityColors[issue.severity]}>
                  {issue.severity}
                </Badge>
                <span className="font-medium">{issue.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{issue.count}</span>
                <span
                  className={`text-sm ${
                    issue.change > 0
                      ? 'text-red-500'
                      : issue.change < 0
                        ? 'text-green-500'
                        : 'text-gray-500'
                  }`}
                >
                  {issue.change > 0 ? '+' : ''}
                  {issue.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
