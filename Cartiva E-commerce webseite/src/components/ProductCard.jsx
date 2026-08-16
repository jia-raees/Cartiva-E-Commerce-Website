import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { getVendor } from '../data/vendors';

export default function ProductCard({ product }) {
  const vendor = getVendor(product.vendorId);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-ink/10 hover:border-marigold/60 hover:shadow-lg hover:shadow-ink/5 transition-all"
    >
      <div
        className="aspect-square relative overflow-hidden"
        style={{ backgroundColor: product.color }}
      >
        {product.image && !imgFailed ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display text-linen/90 text-5xl select-none">
            {product.name.charAt(0)}
          </span>
        )}
        {/* subtle gradient so the badge stays legible over any photo */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
        <span className="absolute top-3 left-3 stall-number text-[10px] bg-ink/50 text-linen rounded-full px-2 py-0.5 backdrop-blur-sm">
          №{vendor?.stallNo}
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs text-ink/50 mb-1">{vendor?.name}</div>
        <h3 className="font-medium text-ink leading-snug group-hover:text-clay transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono font-semibold text-ink">{formatPrice(product.price)}</span>
          <span className="flex items-center gap-1 text-xs text-ink/60">
            <Star className="w-3.5 h-3.5 fill-marigold text-marigold" /> {product.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}
