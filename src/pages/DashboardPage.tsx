import { useMemo } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  TrendingUp,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import SalesChart from '../components/ui/SalesChart';
import EmptyState from '../components/ui/EmptyState';
import {
  formatCurrency,
  formatDateArabic,
  isSameDay,
} from '../utils/formatters';
import type { NavPageId, Order, SalesChartPoint } from '../types';

interface DashboardPageProps {
  onNavigate: (page: NavPageId) => void;
  onAddOrder: () => void;
  onViewOrder: (order: Order) => void;
}

export default function DashboardPage({
  onNavigate,
  onAddOrder,
  onViewOrder,
}: DashboardPageProps) {
  const { orders, settings } = useApp();
  const currency = settings.currency || 'LYD';

  const stats = useMemo(() => {
    const today = new Date();
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.status === 'new' || o.status === 'processing'
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const totalSales = validOrders.reduce(
      (sum, o) => sum + (Number(o.totalPrice) || 0),
      0
    );
    const todaySales = validOrders
      .filter((o) => isSameDay(o.orderDate, today))
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalSales,
      todaySales,
    };
  }, [orders]);

  const weeklyChartData = useMemo<SalesChartPoint[]>(() => {
    const days: SalesChartPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayOrders = orders.filter(
        (o) => o.status !== 'cancelled' && isSameDay(o.orderDate, d)
      );
      const value = dayOrders.reduce(
        (sum, o) => sum + (Number(o.totalPrice) || 0),
        0
      );
      const label = new Intl.DateTimeFormat('ar-LY', {
        weekday: 'long',
      }).format(d);
      const shortLabel = new Intl.DateTimeFormat('ar-LY', {
        weekday: 'short',
      }).format(d);

      days.push({
        key: d.toISOString().split('T')[0],
        label,
        shortLabel,
        value,
        count: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-700 mb-1.5">
            {settings.storeName}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            مرحباً بك في واصل، نظّم طلباتك ومبيعاتك من مكان واحد.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تابع حالة الطلبات اليومية وأداء المبيعات بوضوح وسرعة.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddOrder}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طلب سريع</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="إجمالي المبيعات"
          value={formatCurrency(stats.totalSales, currency)}
          subtitle="بدون الطلبات الملغاة"
          icon={Wallet}
          accent="blue"
        />
        <StatCard
          title="مبيعات اليوم"
          value={formatCurrency(stats.todaySales, currency)}
          subtitle="طلبات اليوم الفعالة"
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          subtitle="جميع الطلبات المسجلة"
          icon={ShoppingBag}
          accent="slate"
        />
        <StatCard
          title="طلبات قيد الانتظار"
          value={stats.pendingOrders}
          subtitle="جديد وقيد التجهيز"
          icon={Clock}
          accent="amber"
        />
        <StatCard
          title="طلبات مكتملة"
          value={stats.completedOrders}
          subtitle="تم توصيلها بنجاح"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="طلبات ملغاة"
          value={stats.cancelledOrders}
          subtitle="تم إلغاؤها"
          icon={XCircle}
          accent="rose"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">مبيعات آخر 7 أيام</h3>
            <p className="text-xs text-slate-500">ملخص الإيرادات اليومية بالدينار الليبي</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap"
          >
            التقارير المفصلة
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
        <SalesChart data={weeklyChartData} currency={currency} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">أحدث الطلبات</h3>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap"
          >
            عرض الكل
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={ShoppingBag}
              title="لا توجد طلبات حتى الآن"
              description="ابدأ بإضافة أول طلب لمتجرك ليظهر هنا."
              actionLabel="إضافة طلب جديد"
              onAction={onAddOrder}
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500 text-xs">
                  <tr>
                    <th className="py-3 px-5 font-semibold">رقم الطلب</th>
                    <th className="py-3 px-4 font-semibold">العميل</th>
                    <th className="py-3 px-4 font-semibold">العنوان</th>
                    <th className="py-3 px-4 font-semibold">الإجمالي</th>
                    <th className="py-3 px-4 font-semibold">التاريخ</th>
                    <th className="py-3 px-5 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => onViewOrder(ord)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-900 tabular-nums">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{ord.customerName}</p>
                        <p className="text-xs text-slate-400 tabular-nums" dir="ltr">
                          {ord.phone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[220px] truncate">
                        {ord.address}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                        {formatCurrency(ord.totalPrice, currency)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {formatDateArabic(ord.orderDate)}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={ord.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => onViewOrder(ord)}
                  className="w-full text-right p-4 hover:bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {ord.orderNumber}
                      </span>
                      <StatusBadge status={ord.status} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-1 truncate">
                      {ord.customerName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{ord.address}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-sm font-bold text-blue-700 tabular-nums">
                      {formatCurrency(ord.totalPrice, currency)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {formatDateArabic(ord.orderDate)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
