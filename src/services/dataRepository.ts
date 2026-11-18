import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../data/sampleData';
import type { Order, Product, StoreSettings } from '../types';

const STORAGE_KEYS = {
  orders: 'wasel_v1_orders',
  products: 'wasel_v1_products',
  settings: 'wasel_v1_settings',
  initialized: 'wasel_v1_initialized',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export interface PersistedState {
  orders: Order[];
  products: Product[];
  settings: StoreSettings;
}

/**
 * طبقة تجريد للبيانات (Repository Layer)
 * تسمح باستبدال localStorage بـ Firestore لاحقاً دون تعديل واجهات المستخدم.
 */
export const dataRepository = {
  loadInitialState(): PersistedState {
    const initialized = window.localStorage.getItem(STORAGE_KEYS.initialized);

    if (!initialized) {
      safeWrite(STORAGE_KEYS.orders, INITIAL_ORDERS);
      safeWrite(STORAGE_KEYS.products, INITIAL_PRODUCTS);
      safeWrite(STORAGE_KEYS.settings, INITIAL_SETTINGS);
      window.localStorage.setItem(STORAGE_KEYS.initialized, 'true');
      return {
        orders: INITIAL_ORDERS,
        products: INITIAL_PRODUCTS,
        settings: INITIAL_SETTINGS,
      };
    }

    return {
      orders: safeRead<Order[]>(STORAGE_KEYS.orders, INITIAL_ORDERS),
      products: safeRead<Product[]>(STORAGE_KEYS.products, INITIAL_PRODUCTS),
      settings: safeRead<StoreSettings>(STORAGE_KEYS.settings, INITIAL_SETTINGS),
    };
  },

  saveOrders(orders: Order[]): boolean {
    return safeWrite(STORAGE_KEYS.orders, orders);
  },

  saveProducts(products: Product[]): boolean {
    return safeWrite(STORAGE_KEYS.products, products);
  },

  saveSettings(settings: StoreSettings): boolean {
    return safeWrite(STORAGE_KEYS.settings, settings);
  },

  resetToSampleData(): PersistedState {
    safeWrite(STORAGE_KEYS.orders, INITIAL_ORDERS);
    safeWrite(STORAGE_KEYS.products, INITIAL_PRODUCTS);
    safeWrite(STORAGE_KEYS.settings, INITIAL_SETTINGS);
    window.localStorage.setItem(STORAGE_KEYS.initialized, 'true');
    return {
      orders: INITIAL_ORDERS,
      products: INITIAL_PRODUCTS,
      settings: INITIAL_SETTINGS,
    };
  },
};
