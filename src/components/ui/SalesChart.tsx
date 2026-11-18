import { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import type { SalesChartPoint } from '../../types';

interface SalesChartProps {
  data?: SalesChartPoint[];
  currency?: string;
  height?: number;
}

export default function SalesChart({
  data = [],
  currency = 'LYD',
  height = 210,
}: SalesChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 100);
  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 min-h-[24px]">
        <span className="text-xs text-slate-500 tabular-nums">
          {activeItem
            ? `${activeItem.label}: ${formatCurrency(activeItem.value, currency)} (${activeItem.count} طلب)`
            : 'اضغط أو مرّر على الأعمدة لعرض التفاصيل'}
        </span>
      </div>

      <div
        className="flex items-end justify-between gap-2 sm:gap-3 pt-4 border-b border-slate-100"
        style={{ height }}
      >
        {data.map((item, idx) => {
          const percent = Math.max(
            (item.value / maxValue) * 100,
            item.value > 0 ? 8 : 2
          );
          const isActive = activeIndex === idx;

          return (
            <button
              key={item.key || idx}
              type="button"
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(isActive ? null : idx)}
              className="flex-1 h-full flex flex-col items-center justify-end gap-2 group focus:outline-none"
            >
              <span
                className={`text-[10px] sm:text-xs font-semibold tabular-nums transition-opacity ${
                  isActive
                    ? 'text-blue-700 opacity-100'
                    : 'text-slate-500 opacity-0 sm:group-hover:opacity-100'
                }`}
              >
                {item.value > 0 ? item.value : ''}
              </span>
              <div className="w-full max-w-[38px] flex-1 flex items-end">
                <div
                  style={{ height: `${percent}%` }}
                  className={`w-full rounded-t-lg transition-colors ${
                    isActive
                      ? 'bg-blue-700'
                      : item.value > 0
                      ? 'bg-blue-500/85 group-hover:bg-blue-600'
                      : 'bg-slate-100'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-3 mt-2">
        {data.map((item, idx) => (
          <div
            key={item.key || idx}
            className="flex-1 text-center text-[10px] sm:text-xs font-medium text-slate-500 truncate"
          >
            {item.shortLabel || item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
