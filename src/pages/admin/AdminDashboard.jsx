import { DollarSign, Store, ShoppingCart, Users } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { vendors } from '../../data/vendors';
import { orders } from '../../data/orders';
import { getVendor } from '../../data/vendors';
import { formatPrice, formatDate } from '../../utils/format';

export default function AdminDashboard() {
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">MARKET OVERSIGHT</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Market overview</h1>
        <p className="text-ink/60 mt-1">Performance across all stalls, this month.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Gross revenue" value={formatPrice(revenue)} delta="+8.1% vs last month" icon={DollarSign} tone="ok" />
        <StatCard label="Active vendors" value={vendors.length} delta="+1 this month" icon={Store} tone="ok" />
        <StatCard label="Total orders" value={orders.length} delta="+15 this week" icon={ShoppingCart} tone="ok" />
        <StatCard label="Customers" value="1,204" delta="+62 this month" icon={Users} tone="ok" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-ink/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink/10">
            <h2 className="font-display text-xl font-semibold text-ink">Latest orders</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Vendor</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.slice(0, 7).map((o) => (
                <tr key={o.id} className="hover:bg-parchment/50">
                  <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-5 py-3 text-ink/70">{getVendor(o.vendorId)?.name}</td>
                  <td className="px-5 py-3 text-ink/60">{formatDate(o.date)}</td>
                  <td className="px-5 py-3 font-mono">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 p-5">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Top stalls</h2>
          <div className="space-y-4">
            {[...vendors].sort((a, b) => b.rating - a.rating).slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-ink">{v.name}</div>
                  <div className="text-ink/50 text-xs">№{v.stallNo} · {v.category}</div>
                </div>
                <div className="font-mono text-ink/70">{v.rating}★</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
