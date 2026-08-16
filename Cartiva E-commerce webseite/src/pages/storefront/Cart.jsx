import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getVendor } from '../../data/vendors';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/format';
import AIRecommendations from '../../components/AIRecommendations';
import { getRecommendationsForItems } from '../../utils/recommendations';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const recommended = getRecommendationsForItems(items, products, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-3xl text-ink mb-2">Your basket is empty.</p>
        <p className="text-ink/60 mb-6">Nothing's been picked up from the stalls yet.</p>
        <Link to="/shop" className="bg-ink text-linen font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-teal transition-colors">
          Browse the market <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Group by vendor stall
  const byVendor = items.reduce((acc, item) => {
    (acc[item.vendorId] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-semibold text-ink mb-8">Your basket</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          {Object.entries(byVendor).map(([vendorId, vendorItems]) => {
            const vendor = getVendor(vendorId);
            return (
              <div key={vendorId} className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
                <div className="px-5 py-3 bg-parchment border-b border-ink/10 text-sm font-medium text-ink/70 flex items-center gap-2">
                  <span className="stall-number text-xs text-clay">№{vendor?.stallNo}</span> {vendor?.name}
                </div>
                <div className="divide-y divide-ink/10">
                  {vendorItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-5">
                      <div
                        className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                      >
                        <span className="font-display text-linen/90 text-xl">{item.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="font-medium text-ink hover:text-clay">
                          {item.name}
                        </Link>
                        <div className="text-sm text-ink/50 font-mono mt-0.5">{formatPrice(item.price)}</div>
                      </div>
                      <div className="flex items-center border border-ink/15 rounded-full">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2" aria-label="Decrease quantity">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-mono text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2" aria-label="Increase quantity">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-mono font-semibold text-ink w-20 text-right">
                        {formatPrice(item.price * item.qty)}
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-ink/30 hover:text-danger" aria-label="Remove item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-ink/10 p-6 h-fit sticky top-24">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Order summary</h2>
          <div className="space-y-2 text-sm text-ink/70">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="font-mono">Calculated at checkout</span></div>
          </div>
          <div className="border-t border-ink/10 mt-4 pt-4 flex justify-between font-semibold text-ink">
            <span>Total</span><span className="font-mono">{formatPrice(subtotal)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 w-full bg-ink text-linen font-semibold rounded-full py-3 flex items-center justify-center gap-2 hover:bg-teal transition-colors"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-16">
          <AIRecommendations
            title="You may also like"
            subtitle="Suggested based on what's in your basket."
            products={recommended}
          />
        </div>
      )}
    </div>
  );
}
