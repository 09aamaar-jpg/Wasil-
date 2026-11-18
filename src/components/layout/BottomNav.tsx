import { NAV_ITEMS } from './Sidebar';
import type { NavPageId } from '../../types';

interface BottomNavProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
}

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="التنقل السفلي"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
    >
      <div className="grid grid-cols-6 h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] font-semibold leading-none truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
