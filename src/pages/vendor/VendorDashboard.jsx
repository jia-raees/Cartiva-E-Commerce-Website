import { DollarSign, ShoppingCart, Package, Star } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { ordersByVendor } from '../../data/orders';
import { productsByVendor } from '../../data/products';
import { formatPrice, formatDate } from '../../utils/format';

export default function VendorDashboard() {
  const { user } = useAuth();
  const vendorId = user?.vendorId ?? 'v1';
  const orders = ordersByVendor(vendorId);
  const myProducts = productsByVendor(vendorId);
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">STALL №{myProducts[0] ? '014' : ''}</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Welcome back, {user?.name}</h1>
        <p className="text-ink/60 mt-1">Here's how your stall is doing this month.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Revenue" value={formatPrice(revenue)} delta="+12.4% vs last month" icon={DollarSign} tone="ok" />
        <StatCard label="Orders" value={orders.length} delta="+3 this week" icon={ShoppingCart} tone="ok" />
        <StatCard label="Products listed" value={myProducts.length} icon={Package} tone="ok" />
        <StatCard label="Store rating" value="4.8" delta="312 reviews" icon={Star} tone="ok" />
      </div>

      <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/10 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Recent orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.slice(0, 6).map((o) => (
              <tr key={o.id} className="hover:bg-parchment/50">
                <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3 text-ink/60">{formatDate(o.date)}</td>
                <td className="px-5 py-3 font-mono">{formatPrice(o.total)}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
