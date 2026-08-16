import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-parchment mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="font-display text-2xl font-semibold text-linen mb-2">Cartiva</div>
          <p className="text-parchment/60 text-sm max-w-xs">
            A marketplace of independent stalls. Every maker keeps their own counter — we just keep the lanterns lit.
          </p>
        </div>
        <div>
          <div className="text-marigold text-xs uppercase tracking-widest mb-3 font-semibold">Shop</div>
          <ul className="space-y-2 text-sm text-parchment/70">
            <li><Link to="/shop" className="hover:text-linen">All goods</Link></li>
            <li><Link to="/vendors" className="hover:text-linen">Browse stalls</Link></li>
            <li><Link to="/cart" className="hover:text-linen">Your cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-marigold text-xs uppercase tracking-widest mb-3 font-semibold">Sell</div>
          <ul className="space-y-2 text-sm text-parchment/70">
            <li><Link to="/vendor" className="hover:text-linen">Vendor dashboard</Link></li>
            <li><Link to="/admin" className="hover:text-linen">Admin panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-linen/10 py-5 text-center text-xs text-parchment/40">
        © 2026 Cartiva Marketplace. A demo storefront — no goods are actually for sale.
      </div>
    </footer>
  );
}
