import { ORDER_STATUSES } from '../../utils/formatters';
import type { OrderStatusKey } from '../../types';

interface StatusBadgeProps {
  status: OrderStatusKey;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const info = ORDER_STATUSES[status] || ORDER_STATUSES.new;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${info.bg} ${info.text} ${info.border}`}
    >
      {info.label}
    </span>
  );
}
