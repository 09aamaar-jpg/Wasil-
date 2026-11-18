import type { OrderStatusKey } from '../types';

export interface OrderStatusMeta {
  key: OrderStatusKey;
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const ORDER_STATUSES: Record<OrderStatusKey, OrderStatusMeta> = {
  new: {
    key: 'new',
    label: 'جديد',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-600',
  },
  processing: {
    key: 'processing',
    label: 'قيد التجهيز',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  delivered: {
    key: 'delivered',
    label: 'تم التوصيل',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
  },
  cancelled: {
    key: 'cancelled',
    label: 'ملغي',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-600',
  },
};

export function formatCurrency(amount: number | string, currency = 'LYD'): string {
  const numeric = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: numeric % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numeric);

  return currency === 'LYD' ? `${formatted} د.ل` : `${formatted} ${currency}`;
}

export function formatDateArabic(isoString?: string): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ar-LY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTimeArabic(isoString?: string): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ar-LY', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function toInputDate(isoString?: string): string {
  const date = isoString ? new Date(isoString) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(isoA: string, dateB = new Date()): boolean {
  const a = new Date(isoA);
  if (Number.isNaN(a.getTime())) return false;
  return (
    a.getFullYear() === dateB.getFullYear() &&
    a.getMonth() === dateB.getMonth() &&
    a.getDate() === dateB.getDate()
  );
}

export function normalizePhone(phone: string | undefined | null): string {
  return String(phone || '')
    .replace(/[\s\-()]/g, '')
    .replace(/^\+218/, '0')
    .replace(/^00218/, '0');
}

export function isValidLibyanPhone(phone: string): boolean {
  const cleaned = normalizePhone(phone);
  return /^09[1-6]\d{7}$/.test(cleaned) || /^0[2-8]\d{7,8}$/.test(cleaned);
}

export function generateId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
