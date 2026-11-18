import { Phone, MapPin, ShoppingBag } from 'lucide-react';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import { formatCurrency, formatDateArabic } from '../../utils/formatters';
import type { Customer } from '../../types';

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
}

export default function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
  currency = 'LYD',
}: CustomerDetailsModalProps) {
  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      subtitle="ملف العميل وسجل الطلبات"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span dir="ltr" className="tabular-nums">{customer.phone}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{customer.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
            <p className="text-xs text-slate-500">إجمالي الطلبات</p>
            <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
              {customer.totalOrders}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
            <p className="text-xs text-slate-500">إجمالي المشتريات</p>
            <p className="text-xl font-bold text-blue-700 mt-1 tabular-nums">
              {formatCurrency(customer.totalPurchases, currency)}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            سجل طلبات العميل ({customer.orders.length})
          </h4>
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {customer.orders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {ord.orderNumber}
                    </span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {(ord.items || []).map((i) => `${i.name} (${i.quantity})`).join('، ')}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDateArabic(ord.orderDate)}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-900 shrink-0 tabular-nums">
                  {formatCurrency(ord.totalPrice, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
