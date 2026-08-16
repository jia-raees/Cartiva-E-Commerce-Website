import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

export default function AIRecommendations({ title, subtitle, products, titleSize = 'text-2xl' }) {
  if (!products || products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles className="w-3.5 h-3.5 text-clay" />
        <span className="stall-number text-clay text-xs">AI PICKS</span>
      </div>
      <h2 className={`font-display ${titleSize} font-semibold text-ink`}>{title}</h2>
      {subtitle && <p className="text-ink/60 text-sm mt-1">{subtitle}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
