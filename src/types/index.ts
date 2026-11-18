export type OrderStatusKey = 'new' | 'processing' | 'delivered' | 'cancelled';

export type NavPageId =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'reports'
  | 'settings';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatusKey;
  orderDate: string;
  notes?: string;
}

export type OrderPayload = Omit<Order, 'id' | 'orderNumber'>;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
}

export type ProductPayload = Omit<Product, 'id' | 'createdAt'>;

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  validOrders: number;
  totalPurchases: number;
  lastOrderDate: string;
  orders: Order[];
}

export interface StoreSettings {
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  city?: string;
  currency: 'LYD' | 'USD' | string;
  notificationsEnabled: boolean;
  lowStockThreshold: number;
  planName: string;
  planStatus: string;
}

export interface SalesChartPoint {
  key?: string;
  label: string;
  shortLabel?: string;
  value: number;
  count: number;
}
