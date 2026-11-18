import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-soft bg-white ${
              isError ? 'border-rose-200' : 'border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <p className="text-sm font-medium text-slate-800">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
