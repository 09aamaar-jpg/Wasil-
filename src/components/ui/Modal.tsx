import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200 max-h-[92dvh] flex flex-col overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -m-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
