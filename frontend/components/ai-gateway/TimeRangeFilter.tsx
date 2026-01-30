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
 * 比較兩個日期範圍是否相同
 */
function isSameDateRange(a: DateRange | undefined, b: DateRangeState): boolean {
  if (!a?.from || !a?.to) return false;
  if (!b.from || !b.to) return false;
  return (
    a.from.getTime() === b.from.getTime() && a.to.getTime() === b.to.getTime()
  );
}

/**
 * 時間範圍篩選器組件
 *
 * 提供快速選擇（1/7/30 天）和自訂日期範圍功能
 * 用於控制儀表板數據的時間範圍
 *
 * 狀態分離設計：
 * - pickerRange: datepicker 內部選擇狀態（不影響 data fetch）
 * - dateRange (props): 實際用於 data fetch 的狀態
 * - 只有選擇完成且日期不同時，才更新 dateRange
 */
export function TimeRangeFilter({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
}: TimeRangeFilterProps) {
  // Datepicker 內部狀態：僅用於 UI 選擇過程，不影響 data fetch
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>(
    undefined,
  );
  const [isOpen, setIsOpen] = useState(false);
  // 追蹤是否已選擇開始日期（用於判斷選擇是否完成）
  const [hasSelectedFrom, setHasSelectedFrom] = useState(false);

  const handlePresetClick = (days: number) => {
    onTimeRangeChange(days);
    onDateRangeChange({ from: undefined, to: undefined });
    setPickerRange(undefined);
    setHasSelectedFrom(false);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!hasSelectedFrom) {
      // 第一次點擊：找出用戶實際點擊的日期作為新的開始日期
      let newFrom: Date | undefined;

      if (!pickerRange?.from || !pickerRange?.to) {
        // 之前沒有完整範圍
        newFrom = range?.from || range?.to;
      } else {
        // 之前有完整範圍，比較找出變化的日期
        const fromChanged =
          range?.from?.getTime() !== pickerRange.from.getTime();
        const toChanged = range?.to?.getTime() !== pickerRange.to.getTime();

        if (fromChanged && range?.from) {
          newFrom = range.from;
        } else if (toChanged && range?.to) {
          newFrom = range.to;
        } else {
          // 點擊了相同的日期或範圍被清空
          newFrom = range?.from || range?.to;
        }
      }

      setPickerRange({ from: newFrom, to: undefined });
      setHasSelectedFrom(true);
    } else if (range?.from && range?.to) {
      // 第二次點擊且有完整範圍：更新並關閉
      setPickerRange(range);
      if (!isSameDateRange(range, dateRange)) {
        onDateRangeChange({ from: range.from, to: range.to });
        onTimeRangeChange(0);
      }
      setIsOpen(false);
      setHasSelectedFrom(false);
    } else {
      // 其他情況：正常更新
      setPickerRange(range);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // 打開時：顯示當前已選擇的日期（如果有），但總是從頭開始選擇流程
      if (dateRange.from && dateRange.to) {
        setPickerRange({ from: dateRange.from, to: dateRange.to });
      } else {
        setPickerRange(undefined);
      }
      // 總是重置選擇狀態，讓用戶重新選擇
      setHasSelectedFrom(false);
    }
    setIsOpen(open);
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
            {!pickerRange?.from ? (
              <div className="text-sm text-slate-400">選擇開始日期</div>
            ) : !pickerRange?.to ? (
              <div className="text-sm text-white">
                {format(pickerRange.from, 'yyyy/MM/dd', { locale: zhTW })} -
                選擇結束日期
              </div>
            ) : (
              <div className="text-sm text-white">
                {format(pickerRange.from, 'yyyy/MM/dd', { locale: zhTW })} -{' '}
                {format(pickerRange.to, 'yyyy/MM/dd', { locale: zhTW })}
              </div>
            )}
          </div>
          <Calendar
            mode="range"
            selected={pickerRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="text-white"
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
