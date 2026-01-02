import { Loader2Icon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2Icon className="w-12 h-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">載入趨勢分析數據</h3>
          <p className="text-sm text-muted-foreground text-center">
            正在分析數據，請稍候...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
