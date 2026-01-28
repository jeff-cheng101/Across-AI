'use client';

import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DateRangeState = {
  from: Date | undefined;
  to: Date | undefined;
};

type TimeRangeFilterProps = {
  timeRange: number;
  dateRange: DateRangeState;
  onTimeRangeChange: (days: number) => void;
  onDateRangeChange: (range: DateRangeState) => void;
};

/**
 * 時間範圍篩選器組件
 *
 * 提供快速選擇（1/7/30 天）和自訂日期範圍功能
 * 用於控制儀表板數據的時間範圍
 */
export function TimeRangeFilter({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
}: TimeRangeFilterProps) {
  // 內部狀態：用於追蹤選擇過程中的日期範圍
  const [internalDateRange, setInternalDateRange] = useState<DateRangeState>({
    from: dateRange.from,
    to: dateRange.to,
  });
  const [isOpen, setIsOpen] = useState(false);
  // 追蹤選擇步驟：0 = 未選擇，1 = 已選開始日期，2 = 已選結束日期
  const [selectionStep, setSelectionStep] = useState(0);

  const handlePresetClick = (days: number) => {
    onTimeRangeChange(days);
    onDateRangeChange({ from: undefined, to: undefined });
    setInternalDateRange({ from: undefined, to: undefined });
    setSelectionStep(0);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    const newRange = {
      from: range?.from,
      to: range?.to,
    };

    if (selectionStep === 0) {
      // 第一次點擊：設定開始日期
      setInternalDateRange({ from: newRange.from, to: undefined });
      setSelectionStep(1);
    } else if (selectionStep === 1) {
      // 第二次點擊：設定結束日期並完成選擇
      setInternalDateRange(newRange);
      setSelectionStep(2);

      // 通知父組件並關閉 popover
      if (newRange.from && newRange.to) {
        onDateRangeChange(newRange);
        onTimeRangeChange(0);
        setIsOpen(false);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // 當打開 popover 時，重置選擇步驟
    if (open) {
      setInternalDateRange({
        from: dateRange.from,
        to: dateRange.to,
      });
      setSelectionStep(dateRange.from && dateRange.to ? 2 : 0);
    }
  };

  const presetButtonClass = (days: number) =>
    `px-3 py-1.5 rounded text-sm transition-colors ${
      timeRange === days && !dateRange.from
        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="flex items-center gap-2 bg-slate-900/40 border border-white/10 rounded p-1">
      <button
        type="button"
        onClick={() => handlePresetClick(1)}
        className={presetButtonClass(1)}
      >
        1天
      </button>
      <button
        type="button"
        onClick={() => handlePresetClick(7)}
        className={presetButtonClass(7)}
      >
        7天
      </button>
      <button
        type="button"
        onClick={() => handlePresetClick(30)}
        className={presetButtonClass(30)}
      >
        30天
      </button>

      <div className="w-px h-6 bg-white/10" />

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`h-8 px-2 hover:bg-white/5 ${
              dateRange.from ? 'text-teal-400' : 'text-slate-400'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-slate-900 border-white/10"
          align="end"
        >
          <div className="p-3 border-b border-white/10">
            {selectionStep === 0 ? (
              <div className="text-sm text-slate-400">選擇開始日期</div>
            ) : selectionStep === 1 && internalDateRange.from ? (
              <div className="text-sm text-white">
                {format(internalDateRange.from, 'yyyy/MM/dd', { locale: zhTW })} - 選擇結束日期
              </div>
            ) : internalDateRange.from && internalDateRange.to ? (
              <div className="text-sm text-white">
                {format(internalDateRange.from, 'yyyy/MM/dd', { locale: zhTW })} -{' '}
                {format(internalDateRange.to, 'yyyy/MM/dd', { locale: zhTW })}
              </div>
            ) : (
              <div className="text-sm text-slate-400">選擇日期範圍</div>
            )}
          </div>
          <Calendar
            mode="range"
            selected={{
              from: internalDateRange.from,
              to: internalDateRange.to,
            }}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="text-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
