import type { LucideIcon } from 'lucide-react';

type StatAccent = 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: StatAccent;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'blue',
}: StatCardProps) {
  const accents: Record<StatAccent, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              accents[accent] || accents.blue
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
