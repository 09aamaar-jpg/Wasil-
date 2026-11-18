import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProductFormModal from '../components/products/ProductFormModal';
import { formatCurrency } from '../utils/formatters';
import type { Product, ProductPayload } from '../types';

export default function ProductsPage() {
  const { products, settings, addProduct, updateProduct, deleteProduct } = useApp();
  const currency = settings.currency || 'LYD';
  const lowThreshold = Number(settings.lowStockThreshold ?? 5);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, search, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSave = (payload: ProductPayload) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
  };

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
              placeholder="ابحث باسم المنتج أو التصنيف..."
              className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? `جميع التصنيفات (${products.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="لا توجد منتجات مطابقة"
          description={
            products.length === 0
              ? 'أضف منتجات متجرك لتتمكن من اختيارها بسهولة عند إنشاء الطلبات.'
              : 'لم يتم العثور على منتجات تطابق بحثك.'
          }
          actionLabel={products.length === 0 ? 'إضافة منتج جديد' : undefined}
          onAction={products.length === 0 ? handleOpenCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock <= lowThreshold;
            const showFallback = !product.image || brokenImages[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {!showFallback ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [product.id]: true }))
                        }
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-blue-700">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-base font-bold text-slate-900 mt-1 tabular-nums">
                      {formatCurrency(product.price, currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        نفد المخزون
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 tabular-nums">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        مخزون منخفض ({product.stock})
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-600 tabular-nums">
                        المتوفر: {product.stock} قطعة
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                      title="تعديل المنتج"
                      aria-label={`تعديل ${product.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(product)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      title="حذف المنتج"
                      aria-label={`حذف ${product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialProduct={editingProduct}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deletingProduct && deleteProduct(deletingProduct.id)}
        title="حذف المنتج"
        message={`هل أنت متأكد من حذف المنتج "${deletingProduct?.name || ''}"؟`}
      />
    </div>
  );
}
