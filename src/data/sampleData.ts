import type { Order, Product, StoreSettings } from '../types';

function daysAgoISO(days: number, hour = 14): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
}

function makeProductThumb(bg: string, fg: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" rx="24" fill="${bg}"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="700" fill="${fg}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'متجر زهرة طرابلس',
  ownerName: 'أحمد الفيتوري',
  phone: '0914528890',
  email: 'ahmad@tripolistore.ly',
  city: 'طرابلس',
  currency: 'LYD',
  notificationsEnabled: true,
  lowStockThreshold: 5,
  planName: 'الباقة الاحترافية',
  planStatus: 'نشطة (تجريبي)',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'سماعة لاسلكية برو الجيل الثالث',
    category: 'إلكترونيات',
    price: 165,
    stock: 18,
    image: makeProductThumb('#EFF6FF', '#1D4ED8', 'سماعة برو'),
    createdAt: daysAgoISO(25),
  },
  {
    id: 'prod_2',
    name: 'عباية كريب ملكي مطرزة',
    category: 'أزياء نسائية',
    price: 240,
    stock: 4,
    image: makeProductThumb('#F8FAFC', '#0F172A', 'عباية ملكي'),
    createdAt: daysAgoISO(22),
  },
  {
    id: 'prod_3',
    name: 'ساعة ذكية رياضية مقاومة للماء',
    category: 'إلكترونيات',
    price: 195,
    stock: 11,
    image: makeProductThumb('#ECFEFF', '#0E7490', 'ساعة ذكية'),
    createdAt: daysAgoISO(20),
  },
  {
    id: 'prod_4',
    name: 'حقيبة جلد طبيعي يومية',
    category: 'إكسسوارات',
    price: 145,
    stock: 3,
    image: makeProductThumb('#FEF3C7', '#92400E', 'حقيبة جلد'),
    createdAt: daysAgoISO(18),
  },
  {
    id: 'prod_5',
    name: 'طقم عناية بالبشرة بالكولاجين',
    category: 'عناية وتجميل',
    price: 120,
    stock: 22,
    image: makeProductThumb('#FDF2F8', '#9D174D', 'طقم عناية'),
    createdAt: daysAgoISO(15),
  },
  {
    id: 'prod_6',
    name: 'شاحن متنقل سريع 20000mAh',
    category: 'إلكترونيات',
    price: 110,
    stock: 0,
    image: makeProductThumb('#F1F5F9', '#334155', 'باور بانك'),
    createdAt: daysAgoISO(12),
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1008',
    orderNumber: 'WSL-1008',
    customerName: 'سارة المصراتي',
    phone: '0912348811',
    address: 'طرابلس - حي الأندلس، شارع المطاعم',
    items: [
      { productId: 'prod_2', name: 'عباية كريب ملكي مطرزة', quantity: 1, price: 240 },
      { productId: 'prod_4', name: 'حقيبة جلد طبيعي يومية', quantity: 1, price: 145 },
    ],
    totalPrice: 385,
    status: 'new',
    orderDate: daysAgoISO(0, 11),
    notes: 'التوصيل بعد الساعة 4 عصراً',
  },
  {
    id: 'ord_1007',
    orderNumber: 'WSL-1007',
    customerName: 'محمد الورفلي',
    phone: '0925567120',
    address: 'بنغازي - الفويهات، قرب جامعة بنغازي',
    items: [
      { productId: 'prod_1', name: 'سماعة لاسلكية برو الجيل الثالث', quantity: 2, price: 165 },
    ],
    totalPrice: 330,
    status: 'processing',
    orderDate: daysAgoISO(0, 9),
    notes: '',
  },
  {
    id: 'ord_1006',
    orderNumber: 'WSL-1006',
    customerName: 'فاطمة الزنتاني',
    phone: '0948812340',
    address: 'طرابلس - بن عاشور، عمارة الفردوس',
    items: [
      { productId: 'prod_5', name: 'طقم عناية بالبشرة بالكولاجين', quantity: 2, price: 120 },
    ],
    totalPrice: 240,
    status: 'delivered',
    orderDate: daysAgoISO(1, 16),
    notes: '',
  },
  {
    id: 'ord_1005',
    orderNumber: 'WSL-1005',
    customerName: 'عبدالله الغرياني',
    phone: '0917741290',
    address: 'مصراتة - شارع طرابلس، وسط المدينة',
    items: [
      { productId: 'prod_3', name: 'ساعة ذكية رياضية مقاومة للماء', quantity: 1, price: 195 },
      { productId: 'prod_1', name: 'سماعة لاسلكية برو الجيل الثالث', quantity: 1, price: 165 },
    ],
    totalPrice: 360,
    status: 'delivered',
    orderDate: daysAgoISO(2, 14),
    notes: '',
  },
  {
    id: 'ord_1004',
    orderNumber: 'WSL-1004',
    customerName: 'سارة المصراتي',
    phone: '0912348811',
    address: 'طرابلس - حي الأندلس، شارع المطاعم',
    items: [
      { productId: 'prod_5', name: 'طقم عناية بالبشرة بالكولاجين', quantity: 1, price: 120 },
    ],
    totalPrice: 120,
    status: 'delivered',
    orderDate: daysAgoISO(3, 18),
    notes: '',
  },
  {
    id: 'ord_1003',
    orderNumber: 'WSL-1003',
    customerName: 'خالد الترهوني',
    phone: '0923319044',
    address: 'طرابلس - سوق الجمعة، طريق الشط',
    items: [
      { productId: 'prod_4', name: 'حقيبة جلد طبيعي يومية', quantity: 1, price: 145 },
    ],
    totalPrice: 145,
    status: 'cancelled',
    orderDate: daysAgoISO(4, 12),
    notes: 'تم إلغاء الطلب بناءً على رغبة العميل',
  },
  {
    id: 'ord_1002',
    orderNumber: 'WSL-1002',
    customerName: 'مريم الساحلي',
    phone: '0916634512',
    address: 'الزاوية - وسط المدينة، قرب المستشفى',
    items: [
      { productId: 'prod_2', name: 'عباية كريب ملكي مطرزة', quantity: 2, price: 240 },
    ],
    totalPrice: 480,
    status: 'delivered',
    orderDate: daysAgoISO(5, 15),
    notes: '',
  },
  {
    id: 'ord_1001',
    orderNumber: 'WSL-1001',
    customerName: 'محمد الورفلي',
    phone: '0925567120',
    address: 'بنغازي - الفويهات، قرب جامعة بنغازي',
    items: [
      { productId: 'prod_3', name: 'ساعة ذكية رياضية مقاومة للماء', quantity: 1, price: 195 },
    ],
    totalPrice: 195,
    status: 'delivered',
    orderDate: daysAgoISO(12, 13),
    notes: '',
  },
];
