import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { getProduct, productsByVendor, products } from '../../data/products';
import { getVendor } from '../../data/vendors';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import AIRecommendations from '../../components/AIRecommendations';
import { recordView, getSimilarProducts } from '../../utils/recommendations';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (product) recordView(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-2xl mb-3">That item isn't on the market floor.</p>
        <Link to="/shop" className="text-clay underline underline-offset-2">Back to shop</Link>
      </div>
    );
  }

  const vendor = getVendor(product.vendorId);
  const more = productsByVendor(product.vendorId).filter((p) => p.id !== product.id).slice(0, 4);
  const recommended = getSimilarProducts(product, products, {
    excludeVendorId: product.vendorId,
    limit: 4,
  });

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-sm text-ink/50 mb-6">
        <Link to="/shop" className="hover:text-clay">Shop</Link> / <span>{product.category}</span> / <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div
          className="aspect-square rounded-2xl overflow-hidden relative"
          style={{ backgroundColor: product.color }}
        >
          {product.image && !imgFailed ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-display text-linen/90 text-8xl select-none">
              {product.name.charAt(0)}
            </span>
          )}
        </div>

        <div>
          <Link to={`/vendors/${vendor.id}`} className="text-sm text-clay hover:text-ink font-medium">
            {vendor.name} · Stall №{vendor.stallNo}
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink mt-2 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-ink/60">
            <Star className="w-4 h-4 fill-marigold text-marigold" /> {product.rating} · {product.reviews} reviews
            <span className="text-ink/30">·</span> SKU {product.sku}
          </div>

          <div className="font-mono text-3xl font-semibold text-ink mt-5">{formatPrice(product.price)}</div>

          <p className="text-ink/70 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-3 text-sm">
            {product.stock > 10 ? (
              <span className="text-ok font-medium">In stock — ships in 1–3 days</span>
            ) : product.stock > 0 ? (
              <span className="text-warn font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-danger font-medium">Out of stock</span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-ink/15 rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5" aria-label="Decrease quantity">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2.5" aria-label="Increase quantity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex-1 bg-ink text-linen font-semibold rounded-full py-3 hover:bg-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {added ? 'Added to cart ✓' : 'Add to cart'}
            </button>
          </div>

          <button
            onClick={() => { addItem(product, qty); navigate('/checkout'); }}
            className="w-full mt-3 border border-ink/20 text-ink font-semibold rounded-full py-3 hover:bg-parchment transition-colors"
          >
            Buy now
          </button>

          <div className="mt-6 space-y-2 text-sm text-ink/60">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Shipped directly from {vendor.name}</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Covered by Bazaar buyer protection</div>
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink mb-5">More from {vendor.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {more.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div className="mt-16">
          <AIRecommendations
            title="You might also like"
            subtitle="Matched by category, price range, and rating across other stalls."
            products={recommended}
          />
        </div>
      )}
    </div>
  );
}
