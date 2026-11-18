import { useMemo, useState } from 'react';
import { Search, Users, Eye, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/ui/EmptyState';
import CustomerDetailsModal from '../components/customers/CustomerDetailsModal';
import { formatCurrency } from '../utils/formatters';
import type { Customer } from '../types';

export default function CustomersPage() {
  const { customers, settings } = useApp();
  const currency = settings.currency || 'LYD';

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم العميل، رقم الهاتف أو المدينة..."
            className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 px-2 tabular-nums">
          إجمالي العملاء: {customers.length}
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="لا يوجد عملاء مطابقون"
          description={
            customers.length === 0
              ? 'يتم إنشاء سجل العملاء تلقائياً بمجرد إضافة طلبات جديدة.'
              : 'جرب البحث باسم أو رقم هاتف مختلف.'
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">اسم العميل</th>
                  <th className="py-3.5 px-4 font-semibold">رقم الهاتف</th>
                  <th className="py-3.5 px-4 font-semibold">العنوان</th>
                  <th className="py-3.5 px-4 font-semibold">عدد الطلبات</th>
                  <th className="py-3.5 px-4 font-semibold">إجمالي المشتريات</th>
                  <th className="py-3.5 px-5 font-semibold">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {customer.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 tabular-nums" dir="ltr">
                      <span className="inline-block text-right">{customer.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[240px] truncate">
                      {customer.address}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 tabular-nums">
                      {customer.totalOrders}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700 tabular-nums">
                      {formatCurrency(customer.totalPurchases, currency)}
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        سجل الطلبات
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => setSelectedCustomer(customer)}
                className="w-full text-right p-4 hover:bg-slate-50 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 tabular-nums">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span dir="ltr">{customer.phone}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.address}</span>
                  </p>
                </div>
                <div className="text-left shrink-0">
                  <p className="text-sm font-bold text-blue-700 tabular-nums">
                    {formatCurrency(customer.totalPurchases, currency)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 tabular-nums">
                    {customer.totalOrders} طلبات
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        currency={currency}
      />
    </div>
  );
}
