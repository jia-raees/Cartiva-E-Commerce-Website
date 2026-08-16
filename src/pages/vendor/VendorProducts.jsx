import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productsByVendor } from '../../data/products';
import StatusBadge from '../../components/StatusBadge';
import { formatPrice } from '../../utils/format';

const emptyForm = { name: '', category: 'Home & Textiles', price: '', stock: '' };

export default function VendorProducts() {
  const { user } = useAuth();
  const vendorId = user?.vendorId ?? 'v1';
  const [products, setProducts] = useState(() =>
    productsByVendor(vendorId).map((p) => ({ ...p }))
  );
  const [editing, setEditing] = useState(null); // product id or 'new'
  const [form, setForm] = useState(emptyForm);

  const stockLabel = (n) => (n === 0 ? 'Out of stock' : n < 5 ? 'Low stock' : 'In stock');

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock });
  };

  const startNew = () => {
    setEditing('new');
    setForm(emptyForm);
  };

  const cancel = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const save = (e) => {
    e.preventDefault();
    if (editing === 'new') {
      const id = `p-new-${Date.now()}`;
      setProducts((prev) => [
        { id, vendorId, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), rating: '—', reviews: 0, color: '#1E5F5A', sku: `BZ-NEW-${prev.length + 1}` },
        ...prev,
      ]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p))
      );
    }
    cancel();
  };

  const remove = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="stall-number text-clay text-xs mb-1">INVENTORY</div>
          <h1 className="font-display text-3xl font-semibold text-ink">Products</h1>
        </div>
        <button
          onClick={startNew}
          className="bg-ink text-linen font-semibold rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-teal transition-colors"
        >
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="bg-white rounded-2xl border border-marigold/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-ink">
              {editing === 'new' ? 'New product' : 'Edit product'}
            </h2>
            <button type="button" onClick={cancel} aria-label="Close form"><X className="w-5 h-5 text-ink/50" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-wide text-ink/50 font-semibold mb-1 block">Product name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink/50 font-semibold mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm bg-white">
                {['Home & Textiles', 'Food & Drink', 'Kitchen', 'Outdoor', 'Stationery'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink/50 font-semibold mb-1 block">Price (USD)</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink/50 font-semibold mb-1 block">Stock quantity</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="bg-marigold text-ink font-semibold rounded-full px-5 py-2.5 hover:bg-marigold-soft transition-colors">
              Save product
            </button>
            <button type="button" onClick={cancel} className="text-ink/60 px-5 py-2.5">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-ink/50 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Stock</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-parchment/50">
                <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-5 py-3 text-ink/60">{p.category}</td>
                <td className="px-5 py-3 font-mono">{formatPrice(p.price)}</td>
                <td className="px-5 py-3"><StatusBadge status={stockLabel(p.stock)} /> <span className="text-ink/40 ml-1 text-xs">({p.stock})</span></td>
                <td className="px-5 py-3">
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => startEdit(p)} className="text-ink/50 hover:text-clay" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(p.id)} className="text-ink/50 hover:text-danger" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-ink/50">No products yet — add your first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
