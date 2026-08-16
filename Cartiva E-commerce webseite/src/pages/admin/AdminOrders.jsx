import { useState } from 'react';
import { orders as initialOrders } from '../../data/orders';
import { getVendor } from '../../data/vendors';
import StatusBadge from '../../components/StatusBadge';
import { formatPrice, formatDate } from '../../utils/format';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders] = useState(initialOrders);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const visible = orders.filter((o) => {
    const matchesStatus = filter === 'All' || o.status === filter;
    const matchesQuery = o.customer.toLowerCase().includes(q.toLowerCase()) || o.id.toLowerCase().includes(q.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">MARKET-WIDE</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Orders</h1>
        <p className="text-ink/60 mt-1">{orders.length} orders across all stalls.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by order ID or customer…"
          className="border border-ink/15 rounded-full px-4 py-2 text-sm w-64 bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                filter === s ? 'bg-ink text-linen border-ink' : 'border-ink/15 text-ink/60 hover:border-ink/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Vendor</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {visible.map((o) => (
              <tr key={o.id} className="hover:bg-parchment/50">
                <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3 text-ink/60">{getVendor(o.vendorId)?.name}</td>
                <td className="px-5 py-3 text-ink/60">{formatDate(o.date)}</td>
                <td className="px-5 py-3 font-mono">{formatPrice(o.total)}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-ink/50">No orders match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
