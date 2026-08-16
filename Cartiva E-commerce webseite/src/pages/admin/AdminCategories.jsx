import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { categories as initialCategories, products } from '../../data/products';

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCat, setNewCat] = useState('');

  const countFor = (c) => products.filter((p) => p.category === c).length;

  const add = (e) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories((prev) => [...prev, newCat.trim()]);
      setNewCat('');
    }
  };

  const remove = (c) => setCategories((prev) => prev.filter((x) => x !== c));

  return (
    <div>
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">TAXONOMY</div>
        <h1 className="font-display text-3xl font-semibold text-ink">Categories</h1>
        <p className="text-ink/60 mt-1">Organize how goods are grouped across the market.</p>
      </div>

      <form onSubmit={add} className="flex gap-3 mb-6 max-w-md">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name"
          className="flex-1 border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        />
        <button type="submit" className="bg-ink text-linen rounded-full px-4 py-2 flex items-center gap-1.5 text-sm font-semibold hover:bg-teal transition-colors">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-ink/10 divide-y divide-ink/10">
        {categories.map((c) => (
          <div key={c} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="font-medium text-ink">{c}</div>
              <div className="text-xs text-ink/50">{countFor(c)} products</div>
            </div>
            <button onClick={() => remove(c)} className="text-ink/40 hover:text-danger" aria-label={`Remove ${c}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
