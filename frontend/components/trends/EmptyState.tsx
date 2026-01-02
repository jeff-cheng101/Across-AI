'use client';

import { FileQuestionIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = '無可用數據',
  description = '目前沒有可顯示的趨勢分析數據',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <FileQuestionIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {description}
          </p>
          {action && (
            <Button onClick={action.onClick} variant="outline">
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
