import { orders } from '../../data/orders';
import { formatPrice } from '../../utils/format';

const names = [
  ['Elena Marsh', 'elena@example.com'], ['A. Whitfield', 'a.whitfield@example.com'],
  ['R. Novak', 'r.novak@example.com'], ['M. Ibarra', 'm.ibarra@example.com'],
  ['S. Delacroix', 's.delacroix@example.com'], ['J. Okafor', 'j.okafor@example.com'],
  ['T. Lindqvist', 't.lindqvist@example.com'], ['P. Andrade', 'p.andrade@example.com'],
  ['H. Kobayashi', 'h.kobayashi@example.com'], ['E. Marsh', 'e.marsh@example.com'],
  ['D. Osei', 'd.osei@example.com'],
];

const customers = names.map(([name, email], i) => {
  const custOrders = orders.filter((o) => o.customer === name);
  const spent = custOrders.reduce((s, o) => s + o.total, 0);
  return {
    id: `cust-${i + 1}`,
    name,
    email,
    orders: custOrders.length || (i % 4),
    spent: spent || (i * 13) % 200,
  };
});

export default function AdminUsers() {
  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">CUSTOMER BASE</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Customers</h1>
        <p className="text-ink/60 mt-1">{customers.length} shoppers with activity on Bazaar.</p>
      </div>

      <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Orders</th>
              <th className="text-left px-5 py-3">Lifetime spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-parchment/50">
                <td className="px-5 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-5 py-3 text-ink/60">{c.email}</td>
                <td className="px-5 py-3 font-mono">{c.orders}</td>
                <td className="px-5 py-3 font-mono">{formatPrice(c.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
