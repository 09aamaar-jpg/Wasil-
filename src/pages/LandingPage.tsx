import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Users,
  BarChart3,
  ArrowLeft,
  Check,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import SalesChart from '../components/ui/SalesChart';
import { formatCurrency, formatDateArabic, isSameDay } from '../utils/formatters';
import type { NavPageId, SalesChartPoint } from '../types';

interface LandingPageProps {
  onEnterDashboard: (initialTab?: NavPageId) => void;
}

const FEATURES = [
  {
    id: 'orders',
    targetTab: 'orders' as NavPageId,
    icon: ShoppingBag,
    title: 'تنظيم الطلبات ومتابعتها.',
    description:
      'سجّل الطلبات الواردة من إنستغرام وفيسبوك في ثوانٍ، وحدّث حالة كل طلب من جديد إلى قيد التجهيز ثم تم التوصيل بكل وضوح.',
  },
  {
    id: 'products-customers',
    targetTab: 'customers' as NavPageId,
    icon: Users,
    title: 'إدارة المنتجات والعملاء.',
    description:
      'تابع كميات المخزون المتوفرة وتنبيهات النفاد، واحفظ بيانات العملاء وسجل مشترياتهم تلقائياً مع كل طلب.',
  },
  {
    id: 'reports',
    targetTab: 'reports' as NavPageId,
    icon: BarChart3,
    title: 'متابعة المبيعات والتقارير.',
    description:
      'اطلع على إجمالي المبيعات اليومية والأسبوعية والشهرية بالدينار الليبي عبر ملخصات دقيقة ورسوم بيانية واضحة.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'سجّل طلباتك.',
    description:
      'أضف اسم العميل، رقم الهاتف الليبي، عنوان التوصيل، والمنتجات المطلوبة بواجهة سريعة مهيأة للهاتف.',
  },
  {
    number: '02',
    title: 'تابع حالة كل طلب.',
    description:
      'غيّر حالة الطلب فوراً بين جديد، قيد التجهيز، تم التوصيل، أو ملغي ليبقى فريقك ومتجرك على اطلاع دائم.',
  },
  {
    number: '03',
    title: 'راقب مبيعاتك من لوحة واحدة.',
    description:
      'شاهد الإيرادات اليومية وأداء آخر 7 أيام وقائمة العملاء الأكثر شراءً في شاشة واحدة مرتبة.',
  },
];

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { orders, products, customers, settings } = useApp();
  const currency = settings.currency || 'LYD';

  const previewStats = useMemo(() => {
    const today = new Date();
    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const totalSales = validOrders.reduce(
      (sum, o) => sum + (Number(o.totalPrice) || 0),
      0
    );
    const todaySales = validOrders
      .filter((o) => isSameDay(o.orderDate, today))
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const pendingOrders = orders.filter(
      (o) => o.status === 'new' || o.status === 'processing'
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;

    return {
      totalSales,
      todaySales,
      pendingOrders,
      completedOrders,
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
      days.push({
        key: d.toISOString().split('T')[0],
        label: new Intl.DateTimeFormat('ar-LY', { weekday: 'long' }).format(d),
        shortLabel: new Intl.DateTimeFormat('ar-LY', { weekday: 'short' }).format(d),
        value: dayOrders.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0),
        count: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const previewOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 3);
  }, [orders]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
              و
            </span>
            <span className="text-base font-bold text-slate-900">
              واصل <span className="text-slate-400 font-medium">| Wasel</span>
            </span>
          </a>

          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              المميزات
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('preview')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              معاينة النظام
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              كيف يعمل
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pricing')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              الأسعار المقترحة
            </button>
          </nav>

          <button
            type="button"
            onClick={() => onEnterDashboard('dashboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>جرّب Wasel</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main id="top">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-20 sm:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-3">
                نسخة تجريبية تفاعلية · مصممة للمتاجر الإلكترونية في ليبيا
              </p>

              <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-[1.2] tracking-tight text-balance">
                طلباتك ومبيعاتك، كلها في مكان واحد.
              </h1>

              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                واصل يساعدك على تنظيم طلبات متجرك، متابعة عملائك، وإدارة مبيعاتك بكل سهولة.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEnterDashboard('dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold shadow-sm transition-colors whitespace-nowrap"
                >
                  <span>جرّب Wasel</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap"
                >
                  <span>اكتشف المميزات</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500">
                <span>واجهة عربية RTL</span>
                <span aria-hidden="true">·</span>
                <span>مهيأ للهواتف وأجهزة iPhone</span>
                <span aria-hidden="true">·</span>
                <span>الدينار الليبي (د.ل)</span>
                <span aria-hidden="true">·</span>
                <span>تجربة مباشرة دون تسجيل حساب</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. FEATURES SECTION */}
        <section id="features" className="py-14 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <p className="text-xs font-semibold text-blue-700 mb-2">
                أدوات عملية لإدارة البيع اليومي
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                كل ما يحتاجه متجرك الإلكتروني لترتيب العمل اليومي
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-2xl border border-slate-200/90 bg-white p-6 flex flex-col justify-between gap-6 hover:border-blue-200 transition-colors"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mt-2">
                        {feature.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEnterDashboard(feature.targetTab)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 self-start whitespace-nowrap"
                    >
                      <span>عاين القسم في النظام</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. DASHBOARD PREVIEW */}
        <section id="preview" className="py-14 sm:py-20 bg-slate-50/80 border-y border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-blue-700 mb-2">
                  معاينة حية من داخل لوحة التحكم
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                  شاهد كيف يدير متجرك الطلبات والمبيعات من شاشة واحدة
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onEnterDashboard('dashboard')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto"
              >
                <span>افتح لوحة التحكم التجريبية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Live Preview Window reusing actual dashboard components */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-slate-200 bg-slate-50 shadow-soft overflow-hidden"
            >
              {/* Preview Top Bar */}
              <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    و
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {settings.storeName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate tabular-nums">
                      {orders.length} طلب · {products.length} منتجات · {customers.length} عملاء
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEnterDashboard('orders')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>الطلبات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEnterDashboard('products')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>المنتجات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEnterDashboard('dashboard')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    <span>تفاعل مع اللوحة</span>
                  </button>
                </div>
              </div>

              {/* Preview Body */}
              <div className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    title="إجمالي المبيعات"
                    value={formatCurrency(previewStats.totalSales, currency)}
                    subtitle="بدون الطلبات الملغاة"
                    icon={Wallet}
                    accent="blue"
                  />
                  <StatCard
                    title="مبيعات اليوم"
                    value={formatCurrency(previewStats.todaySales, currency)}
                    subtitle="طلبات اليوم الفعالة"
                    icon={TrendingUp}
                    accent="emerald"
                  />
                  <StatCard
                    title="قيد الانتظار"
                    value={previewStats.pendingOrders}
                    subtitle="جديد وقيد التجهيز"
                    icon={Clock}
                    accent="amber"
                  />
                  <StatCard
                    title="مكتملة"
                    value={previewStats.completedOrders}
                    subtitle="تم التوصيل"
                    icon={CheckCircle2}
                    accent="emerald"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-card flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        مبيعات آخر 7 أيام
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        تحديث فوري مع كل طلب جديد
                      </p>
                    </div>
                    <div className="mt-3">
                      <SalesChart data={weeklyChartData} currency={currency} height={170} />
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden flex flex-col justify-between">
                    <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        أحدث الطلبات المسجلة
                      </h3>
                      <button
                        type="button"
                        onClick={() => onEnterDashboard('orders')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>إدارة الطلبات</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {previewOrders.map((ord) => (
                        <button
                          key={ord.id}
                          type="button"
                          onClick={() => onEnterDashboard('orders')}
                          className="w-full text-right px-4 sm:px-5 py-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                                {ord.orderNumber}
                              </span>
                              <StatusBadge status={ord.status} />
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-slate-700 mt-1 truncate">
                              {ord.customerName} ·{' '}
                              <span className="text-slate-500 font-normal">{ord.address}</span>
                            </p>
                          </div>
                          <div className="text-left shrink-0">
                            <p className="text-xs sm:text-sm font-bold text-blue-700 tabular-nums">
                              {formatCurrency(ord.totalPrice, currency)}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {formatDateArabic(ord.orderDate)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="py-14 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <p className="text-xs font-semibold text-blue-700 mb-2">
                خطوات واضحة وسريعة
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                كيف يعمل واصل في متجرك؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6"
                >
                  <p className="text-sm font-bold text-blue-600 tabular-nums mb-3">
                    {step.number}.
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRICING PREVIEW */}
        <section id="pricing" className="py-14 sm:py-20 bg-slate-50/70 border-t border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <p className="text-xs font-semibold text-blue-700 mb-2">
                الأسعار التمهيدية المقترحة
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                خطط مرنة تناسب المتاجر الصغيرة والمتنامية
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                تنبيه: هذه الأسعار مقترحة ومبدئية للمرحلة القادمة. الاشتراكات والدفع الإلكتروني
                غير مفعلة حالياً، ويمكنك تجربة النظام بالكامل مجاناً عبر النسخة التجريبية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Free Demo */}
              <div className="rounded-2xl border border-blue-200 bg-white p-6 flex flex-col justify-between gap-6 shadow-card">
                <div>
                  <p className="text-xs font-semibold text-blue-700">متاح الآن</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    النسخة التجريبية المجانية
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-3xl font-bold text-slate-900">0</span>
                    <span className="text-sm font-semibold text-slate-600">د.ل</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    تجربة مباشرة على المتصفح بحفظ محلي
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>إدارة الطلبات والمنتجات والعملاء</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>تقارير المبيعات اليومية والأسبوعية</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>جاهز للاستخدام الفوري من الهاتف</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterDashboard('dashboard')}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  جرّب Wasel الآن
                </button>
              </div>

              {/* Monthly */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500">سعر مقترح · غير مفعل بعد</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    الباقة الشهرية
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-3xl font-bold text-slate-900">15</span>
                    <span className="text-sm font-semibold text-slate-600">د.ل / شهرياً</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    مقترحة للمتاجر النشطة على إنستغرام وفيسبوك
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>مزامنة سحابية للطلبات والعملاء</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>الوصول من أكثر من جهاز</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>تحديثات وميزات مستمرة</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterDashboard('dashboard')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  جرّب النسخة التجريبية مجاناً
                </button>
              </div>

              {/* Annual */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    سعر مقترح · توفير شهرين
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    الباقة السنوية
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-3xl font-bold text-slate-900">150</span>
                    <span className="text-sm font-semibold text-slate-600">د.ل / سنوياً</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    بدلاً من 180 د.ل عند الإطلاق المستقبلي
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>كل مزايا الباقة الشهرية المقترحة</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>أولوية الدعم وتقارير متقدمة</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>توفير 30 د.ل سنوياً</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterDashboard('dashboard')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  جرّب النسخة التجريبية مجاناً
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="py-14 sm:py-20 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 text-balance">
              ابدأ بتنظيم متجرك اليوم.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              ادخل مباشرة إلى النسخة التجريبية التفاعلية وجرّب إضافة الطلبات ومتابعة المبيعات.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => onEnterDashboard('dashboard')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold shadow-sm transition-colors whitespace-nowrap"
              >
                <span>استكشف Wasel</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200/80 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-slate-900">
              Wasel | واصل
            </p>
            <p className="text-sm text-slate-500 mt-1">
              نظام بسيط لإدارة طلبات المتاجر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition-colors"
            >
              المميزات
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('preview')}
              className="hover:text-slate-900 transition-colors"
            >
              معاينة النظام
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pricing')}
              className="hover:text-slate-900 transition-colors"
            >
              الأسعار المقترحة
            </button>
            <button
              type="button"
              onClick={() => onEnterDashboard('dashboard')}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              لوحة التحكم
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
