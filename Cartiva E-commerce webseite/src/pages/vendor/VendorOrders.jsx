import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ordersByVendor } from '../../data/orders';
import StatusBadge from '../../components/StatusBadge';
import { formatPrice, formatDate } from '../../utils/format';

const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function VendorOrders() {
  const { user } = useAuth();
  const vendorId = user?.vendorId ?? 'v1';
  const [orders, setOrders] = useState(() => ordersByVendor(vendorId).map((o) => ({ ...o })));
  const [filter, setFilter] = useState('All');

  const setStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const visible = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">FULFILLMENT</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Orders</h1>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', ...STATUS_FLOW].map((s) => (
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

      <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Item</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {visible.map((o) => (
              <tr key={o.id} className="hover:bg-parchment/50">
                <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3 text-ink/60">{formatDate(o.date)}</td>
                <td className="px-5 py-3 text-ink/70 truncate max-w-[160px]">{o.items[0].name}</td>
                <td className="px-5 py-3 font-mono">{formatPrice(o.total)}</td>
                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="text-xs border border-ink/15 rounded-full px-2 py-1 bg-white"
                  >
                    {STATUS_FLOW.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <span className="ml-2"><StatusBadge status={o.status} /></span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-ink/50">No orders with this status.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
