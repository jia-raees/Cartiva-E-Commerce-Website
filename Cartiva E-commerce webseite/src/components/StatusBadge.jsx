const STYLES = {
  Pending: 'bg-parchment-dim text-ink/70',
  Processing: 'bg-marigold-soft/40 text-clay',
  Shipped: 'bg-teal/15 text-teal',
  Delivered: 'bg-ok/15 text-ok',
  Cancelled: 'bg-danger/10 text-danger',
  Active: 'bg-ok/15 text-ok',
  Suspended: 'bg-danger/10 text-danger',
  'In stock': 'bg-ok/15 text-ok',
  'Low stock': 'bg-warn/15 text-warn',
  'Out of stock': 'bg-danger/10 text-danger',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status] ?? 'bg-parchment-dim text-ink/70'}`}
    >
      {status}
    </span>
  );
}
