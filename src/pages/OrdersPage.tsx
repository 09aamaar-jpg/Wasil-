import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import OrderFormModal from '../components/orders/OrderFormModal';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import {
  ORDER_STATUSES,
  formatCurrency,
  formatDateArabic,
} from '../utils/formatters';
import type { Order, OrderPayload, OrderStatusKey } from '../types';

export default function OrdersPage() {
  const {
    orders,
    products,
    settings,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
  } = useApp();

  const currency = settings.currency || 'LYD';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatusKey>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...orders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .filter((ord) => {
        if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
        if (!q) return true;
        const productsText = (ord.items || []).map((i) => i.name).join(' ').toLowerCase();
        return (
          ord.orderNumber?.toLowerCase().includes(q) ||
          ord.customerName?.toLowerCase().includes(q) ||
          ord.phone?.toLowerCase().includes(q) ||
          ord.address?.toLowerCase().includes(q) ||
          productsText.includes(q)
        );
      });
  }, [orders, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleSave = (payload: OrderPayload) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, payload);
    } else {
      addOrder(payload);
    }
  };

  const statusTabs: { key: 'all' | OrderStatusKey; label: string }[] = [
    { key: 'all', label: `الكل (${orders.length})` },
    ...Object.values(ORDER_STATUSES).map((st) => ({
      key: st.key,
      label: `${st.label} (${orders.filter((o) => o.status === st.key).length})`,
    })),
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الطلب، اسم العميل، الهاتف، العنوان أو المنتج..."
              className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طلب</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors tabular-nums ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="لا توجد طلبات مطابقة"
          description={
            orders.length === 0
              ? 'لم تقم بإضافة أي طلبات بعد. أضف طلبك الأول الآن.'
              : 'جرب تغيير كلمات البحث أو إزالة فلتر الحالة.'
          }
          actionLabel={orders.length === 0 ? 'إضافة طلب جديد' : undefined}
          onAction={orders.length === 0 ? handleOpenCreate : undefined}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">رقم الطلب</th>
                  <th className="py-3.5 px-4 font-semibold">العميل</th>
                  <th className="py-3.5 px-4 font-semibold">العنوان</th>
                  <th className="py-3.5 px-4 font-semibold">المنتجات</th>
                  <th className="py-3.5 px-4 font-semibold">الكمية</th>
                  <th className="py-3.5 px-4 font-semibold">الإجمالي</th>
                  <th className="py-3.5 px-4 font-semibold">التاريخ</th>
                  <th className="py-3.5 px-4 font-semibold">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const totalQty = (ord.items || []).reduce(
                    (sum, i) => sum + (Number(i.quantity) || 0),
                    0
                  );
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap tabular-nums">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{ord.customerName}</p>
                        <p className="text-xs text-slate-400 tabular-nums" dir="ltr">
                          {ord.phone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[190px] truncate">
                        {ord.address}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate">
                        {(ord.items || []).map((i) => i.name).join('، ')}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 tabular-nums">
                        {totalQty}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap tabular-nums">
                        {formatCurrency(ord.totalPrice, currency)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDateArabic(ord.orderDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as OrderStatusKey)
                          }
                          aria-label={`تغيير حالة ${ord.orderNumber}`}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                        >
                          {Object.values(ORDER_STATUSES).map((st) => (
                            <option key={st.key} value={st.key}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingOrder(ord)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="عرض التفاصيل"
                            aria-label={`عرض تفاصيل ${ord.orderNumber}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(ord)}
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="تعديل"
                            aria-label={`تعديل ${ord.orderNumber}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingOrder(ord)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="حذف"
                            aria-label={`حذف ${ord.orderNumber}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-slate-100">
            {filteredOrders.map((ord) => {
              const totalQty = (ord.items || []).reduce(
                (sum, i) => sum + (Number(i.quantity) || 0),
                0
              );
              return (
                <div key={ord.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 tabular-nums">
                          {ord.orderNumber}
                        </span>
                        <StatusBadge status={ord.status} />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {ord.customerName} —{' '}
                        <span className="text-slate-500 font-normal tabular-nums" dir="ltr">
                          {ord.phone}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{ord.address}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-bold text-blue-700 tabular-nums">
                        {formatCurrency(ord.totalPrice, currency)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatDateArabic(ord.orderDate)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl tabular-nums">
                    {(ord.items || []).map((i) => `${i.name} (${i.quantity})`).join('، ')} • إجمالي القطع: {totalQty}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        updateOrderStatus(ord.id, e.target.value as OrderStatusKey)
                      }
                      className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
                    >
                      {Object.values(ORDER_STATUSES).map((st) => (
                        <option key={st.key} value={st.key}>
                          {st.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewingOrder(ord)}
                        className="p-2 text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                        aria-label="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ord)}
                        className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                        aria-label="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingOrder(ord)}
                        className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <OrderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        products={products}
        currency={currency}
        initialOrder={editingOrder}
      />

      <OrderDetailsModal
        order={
          viewingOrder
            ? orders.find((o) => o.id === viewingOrder.id) || viewingOrder
            : null
        }
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        onChangeStatus={updateOrderStatus}
        onEdit={handleOpenEdit}
        currency={currency}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingOrder)}
        onClose={() => setDeletingOrder(null)}
        onConfirm={() => deletingOrder && deleteOrder(deletingOrder.id)}
        title="حذف الطلب"
        message={`هل تريد حذف الطلب ${deletingOrder?.orderNumber || ''}؟ لا يمكن استرجاع الطلب بعد الحذف.`}
      />
    </div>
  );
}
