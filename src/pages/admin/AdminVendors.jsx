import { useState } from 'react';
import { BadgeCheck, Ban, CheckCircle2 } from 'lucide-react';
import { vendors as initialVendors } from '../../data/vendors';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/format';

export default function AdminVendors() {
  const [vendors, setVendors] = useState(
    initialVendors.map((v) => ({ ...v, status: 'Active' }))
  );

  const toggleStatus = (id) =>
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: v.status === 'Active' ? 'Suspended' : 'Active' } : v))
    );

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">DIRECTORY MANAGEMENT</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Vendors</h1>
        <p className="text-ink/60 mt-1">{vendors.length} stalls registered on Bazaar.</p>
      </div>

      <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Stall</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Location</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Rating</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-parchment/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-ink">
                    {v.name} {v.verified && <BadgeCheck className="w-3.5 h-3.5 text-teal" />}
                  </div>
                  <div className="text-xs text-ink/40 font-mono">№{v.stallNo}</div>
                </td>
                <td className="px-5 py-3 text-ink/60">{v.category}</td>
                <td className="px-5 py-3 text-ink/60">{v.location}</td>
                <td className="px-5 py-3 text-ink/60">{formatDate(v.joined)}</td>
                <td className="px-5 py-3 font-mono">{v.rating}★</td>
                <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleStatus(v.id)}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      v.status === 'Active'
                        ? 'border-danger/30 text-danger hover:bg-danger/5'
                        : 'border-ok/30 text-ok hover:bg-ok/5'
                    }`}
                  >
                    {v.status === 'Active' ? <><Ban className="w-3 h-3" /> Suspend</> : <><CheckCircle2 className="w-3 h-3" /> Reactivate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
