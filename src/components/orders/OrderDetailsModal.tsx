import { MapPin, Phone, Calendar, User, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import {
  ORDER_STATUSES,
  formatCurrency,
  formatDateTimeArabic,
} from '../../utils/formatters';
import type { Order, OrderStatusKey } from '../../types';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: (orderId: string, status: OrderStatusKey) => void;
  onEdit: (order: Order) => void;
  currency?: string;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onChangeStatus,
  onEdit,
  currency = 'LYD',
}: OrderDetailsModalProps) {
  if (!order) return null;

  const totalQty = (order.items || []).reduce(
    (sum, it) => sum + (Number(it.quantity) || 0),
    0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تفاصيل الطلب ${order.orderNumber}`}
      subtitle={formatDateTimeArabic(order.orderDate)}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">الحالة الحالية:</span>
            <StatusBadge status={order.status} />
          </div>

          <select
            value={order.status}
            onChange={(e) => onChangeStatus(order.id, e.target.value as OrderStatusKey)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            {Object.values(ORDER_STATUSES).map((st) => (
              <option key={st.key} value={st.key}>
                تغيير إلى: {st.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-slate-700">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <a
              href={`tel:${order.phone}`}
              dir="ltr"
              className="font-medium text-blue-600 hover:underline tabular-nums"
            >
              {order.phone}
            </a>
          </div>
          <div className="flex items-start gap-2.5 text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{order.address}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-xs">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{formatDateTimeArabic(order.orderDate)}</span>
          </div>
          {order.notes && (
            <div className="flex items-start gap-2.5 text-slate-600 bg-amber-50/70 border border-amber-100 p-3 rounded-xl text-xs">
              <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{order.notes}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 mb-2 tabular-nums">
            المنتجات ({totalQty} قطعة)
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white text-sm"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {item.quantity} × {formatCurrency(item.price, currency)}
                  </p>
                </div>
                <span className="font-bold text-slate-900 shrink-0 tabular-nums">
                  {formatCurrency(item.quantity * item.price, currency)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
              <span className="text-sm font-bold text-slate-700">الإجمالي</span>
              <span className="text-base font-bold text-blue-700 tabular-nums">
                {formatCurrency(order.totalPrice, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(order);
            }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            تعديل الطلب
          </button>
        </div>
      </div>
    </Modal>
  );
}
