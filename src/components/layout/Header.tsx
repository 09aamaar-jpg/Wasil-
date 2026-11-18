import { ArrowRight, Plus } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';
import type { NavPageId } from '../../types';

interface HeaderProps {
  activePage: NavPageId;
  storeName: string;
  onQuickAddOrder: () => void;
  onBackToLanding: () => void;
}

export default function Header({
  activePage,
  storeName,
  onQuickAddOrder,
  onBackToLanding,
}: HeaderProps) {
  const current = NAV_ITEMS.find((n) => n.id === activePage);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBackToLanding}
            title="العودة إلى الصفحة الرئيسية"
            aria-label="العودة إلى الصفحة الرئيسية"
            className="lg:hidden w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0"
          >
            و
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {current?.desktopLabel || 'واصل'}
            </h1>
            <p className="text-xs text-slate-500 truncate lg:hidden">{storeName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onBackToLanding}
            className="lg:hidden inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>الموقع</span>
          </button>

          <button
            type="button"
            onClick={onQuickAddOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>طلب جديد</span>
          </button>
        </div>
      </div>
    </header>
  );
}
