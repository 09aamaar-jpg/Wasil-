import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import {
  ORDER_STATUSES,
  formatCurrency,
  isValidLibyanPhone,
  toInputDate,
} from '../../utils/formatters';
import type {
  Order,
  OrderItem,
  OrderPayload,
  OrderStatusKey,
  Product,
} from '../../types';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: OrderPayload) => void;
  products?: Product[];
  currency?: string;
  initialOrder?: Order | null;
}

interface FormErrors {
  customerName?: string;
  phone?: string;
  address?: string;
  items?: string;
}

export default function OrderFormModal({
  isOpen,
  onClose,
  onSave,
  products = [],
  currency = 'LYD',
  initialOrder = null,
}: OrderFormModalProps) {
  const isEdit = Boolean(initialOrder);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<OrderStatusKey>('new');
  const [orderDate, setOrderDate] = useState(toInputDate());
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialOrder) {
      setCustomerName(initialOrder.customerName || '');
      setPhone(initialOrder.phone || '');
      setAddress(initialOrder.address || '');
      setStatus(initialOrder.status || 'new');
      setOrderDate(toInputDate(initialOrder.orderDate));
      setNotes(initialOrder.notes || '');
      setItems(
        initialOrder.items?.length
          ? initialOrder.items.map((it) => ({ ...it }))
          : [
              {
                productId: products[0]?.id || '',
                name: products[0]?.name || '',
                quantity: 1,
                price: products[0]?.price || 0,
              },
            ]
      );
    } else {
      const firstProd = products[0];
      setCustomerName('');
      setPhone('');
      setAddress('');
      setStatus('new');
      setOrderDate(toInputDate());
      setNotes('');
      setItems([
        firstProd
          ? { productId: firstProd.id, name: firstProd.name, quantity: 1, price: firstProd.price }
          : { productId: '', name: '', quantity: 1, price: 0 },
      ]);
    }
    setErrors({});
  }, [isOpen, initialOrder, products]);

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
        0
      ),
    [items]
  );

  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? prod
            ? { ...item, productId: prod.id, name: prod.name, price: prod.price }
            : { ...item, productId: '', name: '', price: 0 }
          : item
      )
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const addItemRow = () => {
    const firstProd = products[0];
    setItems((prev) => [
      ...prev,
      firstProd
        ? { productId: firstProd.id, name: firstProd.name, quantity: 1, price: firstProd.price }
        : { productId: '', name: '', quantity: 1, price: 0 },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = 'يرجى إدخال اسم العميل (حرفان على الأقل)';
    }
    if (!phone.trim() || !isValidLibyanPhone(phone)) {
      nextErrors.phone = 'يرجى إدخال رقم هاتف ليبي صحيح (مثال: 0912345678)';
    }
    if (!address.trim()) {
      nextErrors.address = 'يرجى إدخال عنوان التوصيل';
    }
    const validItems = items.filter(
      (it) => it.name.trim() && Number(it.quantity) > 0 && Number(it.price) > 0
    );
    if (validItems.length === 0 || validItems.length !== items.length) {
      nextErrors.items = 'تأكد من اختيار المنتج وتحديد كمية وسعر أكبر من صفر';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const chosenDate = new Date(orderDate);
    chosenDate.setHours(now.getHours(), now.getMinutes(), 0, 0);

    onSave({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      status,
      orderDate: chosenDate.toISOString(),
      notes: notes.trim(),
      items: items.map((it) => ({
        productId: it.productId || '',
        name: it.name.trim(),
        quantity: Number(it.quantity),
        price: Number(it.price),
      })),
      totalPrice,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit && initialOrder ? `تعديل الطلب ${initialOrder.orderNumber}` : 'إضافة طلب جديد'}
      subtitle="أدخل بيانات العميل والمنتجات المطلوبة"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              اسم العميل *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: سارة المصراتي"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            {errors.customerName && (
              <p className="text-xs text-rose-600 mt-1">{errors.customerName}</p>
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
              placeholder="0912345678"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-right tabular-nums"
            />
            {errors.phone && (
              <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            عنوان التوصيل *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="المدينة - المنطقة - أقرب نقطة دالة"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
          {errors.address && (
            <p className="text-xs text-rose-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">المنتجات المطلوبة *</span>
            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج
            </button>
          </div>

          {items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200"
            >
              <div className="col-span-12 sm:col-span-6">
                {products.length > 0 ? (
                  <select
                    value={item.productId || '__custom__'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        handleItemChange(idx, 'productId', '');
                      } else {
                        handleProductSelect(idx, e.target.value);
                      }
                    }}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-blue-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatCurrency(p.price, currency)})
                      </option>
                    ))}
                    <option value="__custom__">— منتج مخصص —</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="اسم المنتج"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                  />
                )}

                {item.productId === '' && products.length > 0 && (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="اكتب اسم المنتج المخصص"
                    className="w-full mt-2 px-2.5 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                  />
                )}
              </div>

              <div className="col-span-5 sm:col-span-2">
                <label className="block sm:hidden text-[10px] text-slate-400 mb-0.5">
                  الكمية
                </label>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm text-center outline-none focus:border-blue-500 tabular-nums"
                />
              </div>

              <div className="col-span-5 sm:col-span-3">
                <label className="block sm:hidden text-[10px] text-slate-400 mb-0.5">
                  السعر
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  value={item.price}
                  onChange={(e) => handleItemChange(idx, 'price', Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm text-center outline-none focus:border-blue-500 tabular-nums"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  disabled={items.length === 1}
                  className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg"
                  aria-label="حذف الصنف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {errors.items && <p className="text-xs text-rose-600">{errors.items}</p>}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600">الإجمالي النهائي</span>
            <span className="text-base font-bold text-blue-700 tabular-nums">
              {formatCurrency(totalPrice, currency)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              حالة الطلب
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatusKey)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
            >
              {Object.values(ORDER_STATUSES).map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              تاريخ الطلب
            </label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ملاحظات (اختياري)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي ملاحظات إضافية للتوصيل..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'حفظ التعديلات' : 'إضافة الطلب'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
