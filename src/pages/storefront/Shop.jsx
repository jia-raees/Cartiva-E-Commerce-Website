import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { products, categories } from '../../data/products';
import ProductCard from '../../components/ProductCard';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(200);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    if (category !== 'All') list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, category, sort, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">THE MARKET FLOOR</div>
        <h1 className="font-display text-4xl font-semibold text-ink">
          {q ? `Results for "${q}"` : 'All goods'}
        </h1>
        <p className="text-ink/60 mt-1">{filtered.length} items across {categories.length} categories</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-ink/10 p-5 sticky top-24">
            <div className="flex items-center gap-2 font-semibold text-ink mb-4">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </div>

            <div className="mb-6">
              <div className="text-xs uppercase tracking-wide text-ink/50 font-semibold mb-2">Category</div>
              <div className="space-y-1">
                {['All', ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      category === c ? 'bg-marigold/20 text-clay font-medium' : 'text-ink/70 hover:bg-parchment'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-ink/50 font-semibold mb-2">
                Max price: <span className="font-mono text-ink">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-marigold"
              />
            </div>

            {q && (
              <button
                onClick={() => setParams({})}
                className="mt-6 text-xs text-clay underline underline-offset-2"
              >
                Clear search
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-ink/15 rounded-full px-3 py-1.5 bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-ink/50">
              <p className="font-display text-xl mb-1">No stalls have this one today.</p>
              <p className="text-sm">Try a broader search or a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
