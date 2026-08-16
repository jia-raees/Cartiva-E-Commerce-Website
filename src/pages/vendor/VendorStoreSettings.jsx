import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVendor } from '../../data/vendors';

const inputClass = "w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marigold bg-white";
const labelClass = "text-xs uppercase tracking-wide text-ink/50 font-semibold mb-1 block";

export default function VendorStoreSettings() {
  const { user } = useAuth();
  const vendor = getVendor(user?.vendorId ?? 'v1');
  const [form, setForm] = useState({
    name: vendor?.name ?? '',
    tagline: vendor?.tagline ?? '',
    location: vendor?.location ?? '',
    category: vendor?.category ?? '',
  });
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">STALL №{vendor?.stallNo}</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Store settings</h1>
        <p className="text-ink/60 mt-1">How your stall appears to shoppers.</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-ink/10 p-6 max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Store name</label>
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input className={inputClass} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Primary category</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Home & Textiles', 'Food & Drink', 'Kitchen', 'Outdoor', 'Stationery'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="bg-ink text-linen font-semibold rounded-full px-5 py-2.5 hover:bg-teal transition-colors">
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
