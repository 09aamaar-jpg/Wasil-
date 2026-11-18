import React, { useEffect, useState } from 'react';
import { Store, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { isValidLibyanPhone } from '../utils/formatters';

interface SettingsErrors {
  storeName?: string;
  ownerName?: string;
  phone?: string;
}

export default function SettingsPage() {
  const { settings, updateSettings, resetSampleData } = useApp();

  const [storeName, setStoreName] = useState(settings.storeName || '');
  const [ownerName, setOwnerName] = useState(settings.ownerName || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || '');
  const [currency, setCurrency] = useState(settings.currency || 'LYD');
  const [lowStockThreshold, setLowStockThreshold] = useState(
    String(settings.lowStockThreshold ?? 5)
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    Boolean(settings.notificationsEnabled)
  );
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setStoreName(settings.storeName || '');
    setOwnerName(settings.ownerName || '');
    setPhone(settings.phone || '');
    setEmail(settings.email || '');
    setCurrency(settings.currency || 'LYD');
    setLowStockThreshold(String(settings.lowStockThreshold ?? 5));
    setNotificationsEnabled(Boolean(settings.notificationsEnabled));
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: SettingsErrors = {};
    if (!storeName.trim()) next.storeName = 'يرجى إدخال اسم المتجر';
    if (!ownerName.trim()) next.ownerName = 'يرجى إدخال اسم مالك المتجر';
    if (!phone.trim() || !isValidLibyanPhone(phone)) {
      next.phone = 'يرجى إدخال رقم هاتف ليبي صحيح';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateSettings({
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      currency,
      lowStockThreshold: Math.max(1, Number(lowStockThreshold) || 5),
      notificationsEnabled,
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card space-y-5"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">معلومات المتجر والحساب</h2>
            <p className="text-xs text-slate-500">
              قم بتخصيص بيانات متجرك وإعدادات العملة والتنبيهات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              اسم المتجر *
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
            {errors.storeName && (
              <p className="text-xs text-rose-600 mt-1">{errors.storeName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              اسم مالك المتجر *
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
            {errors.ownerName && (
              <p className="text-xs text-rose-600 mt-1">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              inputMode="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-right tabular-nums"
            />
            {errors.phone && (
              <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              البريد الإلكتروني للحساب
            </label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              العملة الافتراضية
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
            >
              <option value="LYD">دينار ليبي (LYD / د.ل)</option>
              <option value="USD">دولار أمريكي (USD)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              تنبيه انخفاض المخزون عند
            </label>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none tabular-nums"
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-slate-800">تنبيهات الطلبات والمخزون</p>
            <p className="text-xs text-slate-500">
              عرض إشعارات فورية عند تحديث الطلبات أو نقص المنتجات
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded"
          />
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            حفظ الإعدادات
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">معلومات باقة الاشتراك</h3>
              <p className="text-xs text-slate-500">حالة اشتراك المتجر في منصة واصل</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            {settings.planStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-sm">
          <div>
            <p className="text-xs text-slate-500">الباقة الحالية</p>
            <p className="font-bold text-slate-900 mt-0.5">{settings.planName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">الحد الشهري للطلبات</p>
            <p className="font-bold text-slate-900 mt-0.5">غير محدود</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">بوابة الدفع الإلكتروني</p>
            <p className="font-medium text-slate-600 mt-0.5">ستُضاف عند الإطلاق الرسمي</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              البيانات المحلية والجاهزية السحابية
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              تُحفظ البيانات حالياً في المتصفح (LocalStorage). البنية مهيأة للربط مع
              Firebase Auth و Firestore دون أي اتصال نشط حالياً.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0 whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          استعادة البيانات التجريبية
        </button>
      </div>

      <ConfirmDialog
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetSampleData}
        title="استعادة البيانات التجريبية"
        message="سيتم استبدال الطلبات والمنتجات والإعدادات الحالية بالبيانات التجريبية الافتراضية. هل تود المتابعة؟"
        confirmLabel="نعم، استعد البيانات"
      />
    </div>
  );
}
