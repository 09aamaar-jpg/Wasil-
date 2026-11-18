import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { dataRepository } from '../services/dataRepository';
import { generateId, normalizePhone } from '../utils/formatters';
import { useToast } from './ToastContext';
import type {
  Customer,
  Order,
  OrderPayload,
  OrderStatusKey,
  Product,
  ProductPayload,
  StoreSettings,
} from '../types';

interface AppContextValue {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  settings: StoreSettings;
  addOrder: (payload: OrderPayload) => Order;
  updateOrder: (orderId: string, updatedFields: Partial<OrderPayload>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatusKey) => void;
  deleteOrder: (orderId: string) => void;
  addProduct: (payload: ProductPayload) => Product;
  updateProduct: (productId: string, updatedFields: Partial<ProductPayload>) => void;
  deleteProduct: (productId: string) => void;
  updateSettings: (updated: Partial<StoreSettings>) => void;
  resetSampleData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [initial] = useState(() => dataRepository.loadInitialState());

  const [orders, setOrders] = useState<Order[]>(initial.orders);
  const [products, setProducts] = useState<Product[]>(initial.products);
  const [settings, setSettings] = useState<StoreSettings>(initial.settings);

  useEffect(() => {
    dataRepository.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    dataRepository.saveProducts(products);
  }, [products]);

  useEffect(() => {
    dataRepository.saveSettings(settings);
  }, [settings]);

  // اشتقاق قائمة العملاء تلقائياً من الطلبات لضمان تطابق الأرقام والإحصائيات دائماً
  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();

    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    for (const order of sortedOrders) {
      const key = normalizePhone(order.phone) || order.customerName.trim();
      const existing = map.get(key);
      const isCancelled = order.status === 'cancelled';

      if (!existing) {
        map.set(key, {
          id: `cust_${key}`,
          name: order.customerName,
          phone: order.phone,
          address: order.address,
          totalOrders: 1,
          validOrders: isCancelled ? 0 : 1,
          totalPurchases: isCancelled ? 0 : Number(order.totalPrice) || 0,
          lastOrderDate: order.orderDate,
          orders: [order],
        });
      } else {
        existing.totalOrders += 1;
        if (!isCancelled) {
          existing.validOrders += 1;
          existing.totalPurchases += Number(order.totalPrice) || 0;
        }
        existing.orders.push(order);
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalPurchases - a.totalPurchases
    );
  }, [orders]);

  const addOrder = useCallback(
    (payload: OrderPayload): Order => {
      const nextNum =
        orders.reduce((max, ord) => {
          const match = String(ord.orderNumber || '').match(/\d+/);
          const num = match ? parseInt(match[0], 10) : 1000;
          return Math.max(max, num);
        }, 1000) + 1;

      const newOrder: Order = {
        ...payload,
        id: generateId('ord'),
        orderNumber: `WSL-${nextNum}`,
      };

      setOrders((prev) => [newOrder, ...prev]);
      showToast(`تم إضافة الطلب ${newOrder.orderNumber} بنجاح`);
      return newOrder;
    },
    [orders, showToast]
  );

  const updateOrder = useCallback(
    (orderId: string, updatedFields: Partial<OrderPayload>) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, ...updatedFields } : ord
        )
      );
      showToast('تم تحديث بيانات الطلب بنجاح');
    },
    [showToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatusKey) => {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
      );
      showToast('تم تغيير حالة الطلب');
    },
    [showToast]
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
      showToast('تم حذف الطلب بنجاح');
    },
    [showToast]
  );

  const addProduct = useCallback(
    (payload: ProductPayload): Product => {
      const newProduct: Product = {
        ...payload,
        id: generateId('prod'),
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast('تمت إضافة المنتج بنجاح');
      return newProduct;
    },
    [showToast]
  );

  const updateProduct = useCallback(
    (productId: string, updatedFields: Partial<ProductPayload>) => {
      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === productId ? { ...prod, ...updatedFields } : prod
        )
      );
      showToast('تم تحديث بيانات المنتج');
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((prod) => prod.id !== productId));
      showToast('تم حذف المنتج بنجاح');
    },
    [showToast]
  );

  const updateSettings = useCallback(
    (updated: Partial<StoreSettings>) => {
      setSettings((prev) => ({ ...prev, ...updated }));
      showToast('تم حفظ إعدادات المتجر بنجاح');
    },
    [showToast]
  );

  const resetSampleData = useCallback(() => {
    const fresh = dataRepository.resetToSampleData();
    setOrders(fresh.orders);
    setProducts(fresh.products);
    setSettings(fresh.settings);
    showToast('تمت استعادة البيانات التجريبية بنجاح');
  }, [showToast]);

  const value: AppContextValue = {
    orders,
    products,
    customers,
    settings,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    resetSampleData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
