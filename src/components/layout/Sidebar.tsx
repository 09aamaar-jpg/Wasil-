import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  Store,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { NavPageId } from '../../types';

export interface NavItem {
  id: NavPageId;
  label: string;
  desktopLabel: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'الرئيسية', desktopLabel: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'orders', label: 'الطلبات', desktopLabel: 'الطلبات', icon: ShoppingBag },
  { id: 'products', label: 'المنتجات', desktopLabel: 'المنتجات', icon: Package },
  { id: 'customers', label: 'العملاء', desktopLabel: 'العملاء', icon: Users },
  { id: 'reports', label: 'التقارير', desktopLabel: 'التقارير', icon: BarChart3 },
  { id: 'settings', label: 'الإعدادات', desktopLabel: 'الإعدادات', icon: Settings },
];

interface SidebarProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
  onBackToLanding: () => void;
  storeName: string;
}

export default function Sidebar({
  activePage,
  onNavigate,
  onBackToLanding,
  storeName,
}: SidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:right-0 bg-white border-l border-slate-200 z-30">
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          و
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">
            واصل <span className="text-slate-400 font-medium">| Wasel</span>
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{storeName}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.desktopLabel}</span>
            </button>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            <ArrowRight className="w-5 h-5 shrink-0 text-slate-400" />
            <span>الصفحة التعريفية</span>
          </button>
        </div>
      </nav>

      <div className="p-4 m-3 rounded-2xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Store className="w-4 h-4 text-blue-600 shrink-0" />
          <span>حفظ محلي تلقائي</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          يتم حفظ جميع تغييراتك محلياً على جهازك، وجاهز للربط مع Firebase لاحقاً.
        </p>
      </div>
    </aside>
  );
}
