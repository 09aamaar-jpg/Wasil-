import { useMemo, useState } from 'react';
import {
  TrendingUp,
  CalendarDays,
  CalendarRange,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import SalesChart from '../components/ui/SalesChart';
import { formatCurrency, isSameDay } from '../utils/formatters';
import type { SalesChartPoint } from '../types';

export default function ReportsPage() {
  const { orders, settings } = useApp();
  const currency = settings.currency || 'LYD';
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const report = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now);
    startOfMonth.setDate(now.getDate() - 29);
    startOfMonth.setHours(0, 0, 0, 0);

    const validOrders = orders.filter((o) => o.status !== 'cancelled');

    const dailySales = validOrders
      .filter((o) => isSameDay(o.orderDate, now))
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    const weeklySales = validOrders
      .filter((o) => new Date(o.orderDate) >= startOfWeek)
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    const monthlySales = validOrders
      .filter((o) => new Date(o.orderDate) >= startOfMonth)
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    const totalRevenue = validOrders.reduce(
      (sum, o) => sum + (Number(o.totalPrice) || 0),
      0
    );

    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    return {
      dailySales,
      weeklySales,
      monthlySales,
      totalRevenue,
      totalOrders: orders.length,
      completedOrders,
      cancelledOrders,
    };
  }, [orders]);

  const chartData = useMemo<SalesChartPoint[]>(() => {
    if (chartPeriod === 'weekly') {
      const days: SalesChartPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayOrders = orders.filter(
          (o) => o.status !== 'cancelled' && isSameDay(o.orderDate, d)
        );
        days.push({
          key: d.toISOString().split('T')[0],
          label: new Intl.DateTimeFormat('ar-LY', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          }).format(d),
          shortLabel: new Intl.DateTimeFormat('ar-LY', { weekday: 'short' }).format(d),
          value: dayOrders.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0),
          count: dayOrders.length,
        });
      }
      return days;
    }

    const weeks: SalesChartPoint[] = [];
    for (let w = 3; w >= 0; w--) {
      const end = new Date();
      end.setDate(end.getDate() - w * 7);
      end.setHours(23, 59, 59, 999);

      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      const weekOrders = orders.filter((o) => {
        if (o.status === 'cancelled') return false;
        const dt = new Date(o.orderDate);
        return dt >= start && dt <= end;
      });

      weeks.push({
        key: `w_${w}`,
        label: `الأسبوع ${4 - w}`,
        shortLabel: `أسبوع ${4 - w}`,
        value: weekOrders.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0),
        count: weekOrders.length,
      });
    }
    return weeks;
  }, [orders, chartPeriod]);

  const completionRate =
    report.totalOrders > 0
      ? Math.round((report.completedOrders / report.totalOrders) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="المبيعات اليومية"
          value={formatCurrency(report.dailySales, currency)}
          subtitle="اليوم"
          icon={TrendingUp}
          accent="blue"
        />
        <StatCard
          title="المبيعات الأسبوعية"
          value={formatCurrency(report.weeklySales, currency)}
          subtitle="آخر 7 أيام"
          icon={CalendarDays}
          accent="emerald"
        />
        <StatCard
          title="المبيعات الشهرية"
          value={formatCurrency(report.monthlySales, currency)}
          subtitle="آخر 30 يوماً"
          icon={CalendarRange}
          accent="blue"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={formatCurrency(report.totalRevenue, currency)}
          subtitle="جميع الطلبات الفعالة"
          icon={Wallet}
          accent="slate"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="عدد الطلبات"
          value={report.totalOrders}
          subtitle={`نسبة الإتمام ${completionRate}%`}
          icon={ShoppingBag}
          accent="slate"
        />
        <StatCard
          title="الطلبات المكتملة"
          value={report.completedOrders}
          subtitle="تم التوصيل"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="الطلبات الملغاة"
          value={report.cancelledOrders}
          subtitle="مستبعدة من الإيرادات"
          icon={XCircle}
          accent="rose"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">مخطط المبيعات</h3>
            <p className="text-xs text-slate-500">
              مقارنة الأداء المالي خلال الفترة المحددة
            </p>
          </div>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start">
            <button
              type="button"
              onClick={() => setChartPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                chartPeriod === 'weekly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              أسبوعي (7 أيام)
            </button>
            <button
              type="button"
              onClick={() => setChartPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                chartPeriod === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              شهري (4 أسابيع)
            </button>
          </div>
        </div>

        <SalesChart data={chartData} currency={currency} height={240} />
      </div>
    </div>
  );
}
