import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import type { Product, ProductPayload } from '../../types';

const CATEGORIES = [
  'إلكترونيات',
  'أزياء نسائية',
  'أزياء رجالية',
  'إكسسوارات',
  'عناية وتجميل',
  'أدوات منزلية',
  'أخرى',
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: ProductPayload) => void;
  initialProduct?: Product | null;
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
  image?: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialProduct = null,
}: ProductFormModalProps) {
  const isEdit = Boolean(initialProduct);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialProduct) {
      setName(initialProduct.name || '');
      setCategory(initialProduct.category || CATEGORIES[0]);
      setPrice(String(initialProduct.price ?? ''));
      setStock(String(initialProduct.stock ?? ''));
      setImage(initialProduct.image || '');
    } else {
      setName('');
      setCategory(CATEGORIES[0]);
      setPrice('');
      setStock('10');
      setImage('');
    }
    setErrors({});
  }, [isOpen, initialProduct]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'يفضل أن يكون حجم الصورة أقل من 500 كيلوبايت',
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result || ''));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = 'يرجى إدخال اسم المنتج';
    }
    if (price === '' || Number(price) <= 0) {
      next.price = 'يرجى إدخال سعر صحيح أكبر من صفر';
    }
    if (stock === '' || Number(stock) < 0) {
      next.stock = 'يرجى إدخال كمية مخزون صحيحة (0 أو أكثر)';
    }
    if (!category.trim()) {
      next.category = 'يرجى تحديد التصنيف';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      image: image.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      subtitle="أضف تفاصيل المنتج والمخزون المتاح"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            اسم المنتج *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: ساعة ذكية رياضية"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
          />
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              التصنيف *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              السعر (د.ل) *
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="150"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none tabular-nums"
            />
            {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              كمية المخزون *
            </label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none tabular-nums"
            />
            {errors.stock && <p className="text-xs text-rose-600 mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            صورة المنتج (رابط أو رفع من الجهاز)
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="url"
              dir="ltr"
              value={image.startsWith('data:') ? '' : image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/product.jpg"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-right"
            />
            <label className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer shrink-0 whitespace-nowrap">
              رفع صورة
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
          {image && (
            <div className="mt-2.5 flex items-center gap-3">
              <img
                src={image}
                alt="معاينة"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <button
                type="button"
                onClick={() => setImage('')}
                className="text-xs text-rose-600 hover:underline"
              >
                إزالة الصورة
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
