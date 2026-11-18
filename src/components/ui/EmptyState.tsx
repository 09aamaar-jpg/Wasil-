import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
