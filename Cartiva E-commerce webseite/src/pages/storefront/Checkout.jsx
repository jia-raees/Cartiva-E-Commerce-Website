import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';

const inputClass = "w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marigold bg-white";
const labelClass = "text-xs uppercase tracking-wide text-ink/50 font-semibold mb-1 block";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const shipping = items.length ? 6.5 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <CheckCircle2 className="w-14 h-14 text-ok mx-auto mb-4" />
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Order placed.</h1>
        <p className="text-ink/60 mb-6">
          Order <span className="font-mono">#BZ-{Math.floor(10000 + Math.random() * 89999)}</span> is on its way to each vendor's stall for packing.
        </p>
        <Link to="/shop" className="bg-ink text-linen font-semibold px-6 py-3 rounded-full inline-block hover:bg-teal transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink mb-2">Nothing to check out yet.</p>
        <Link to="/shop" className="text-clay underline underline-offset-2">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-semibold text-ink mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-ink/10 p-6">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Full name</label><input required className={inputClass} placeholder="Elena Marsh" /></div>
              <div><label className={labelClass}>Email</label><input required type="email" className={inputClass} placeholder="you@example.com" /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Street address</label><input required className={inputClass} placeholder="12 Lantern Row" /></div>
              <div><label className={labelClass}>City</label><input required className={inputClass} placeholder="Karachi" /></div>
              <div><label className={labelClass}>Postal code</label><input required className={inputClass} placeholder="75500" /></div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink/10 p-6">
            <h2 className="font-display text-xl font-semibold text-ink mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Payment
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={labelClass}>Card number</label><input required className={inputClass} placeholder="4242 4242 4242 4242" /></div>
              <div><label className={labelClass}>Expiry</label><input required className={inputClass} placeholder="MM/YY" /></div>
              <div><label className={labelClass}>CVC</label><input required className={inputClass} placeholder="123" /></div>
            </div>
            <p className="text-xs text-ink/40 mt-3">Demo checkout — no real payment is processed.</p>
          </section>
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 p-6 h-fit sticky top-24">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Order summary</h2>
          <div className="space-y-2 text-sm max-h-48 overflow-auto mb-3">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-ink/70">
                <span className="truncate pr-2">{i.name} × {i.qty}</span>
                <span className="font-mono shrink-0">{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 pt-3 space-y-1.5 text-sm text-ink/70">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="font-mono">{formatPrice(shipping)}</span></div>
          </div>
          <div className="border-t border-ink/10 mt-3 pt-3 flex justify-between font-semibold text-ink">
            <span>Total</span><span className="font-mono">{formatPrice(subtotal + shipping)}</span>
          </div>
          <button type="submit" className="mt-6 w-full bg-ink text-linen font-semibold rounded-full py-3 hover:bg-teal transition-colors">
            Place order
          </button>
        </div>
      </form>
    </div>
  );
}
