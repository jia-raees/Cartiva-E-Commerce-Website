import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Store, LayoutDashboard, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { count } = useCart();
  const { user, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur border-b border-ink/10">
      <div className="woven-rule" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">Cartiva</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search stalls, makers, goods…"
            className="w-full rounded-full border border-ink/15 bg-white/70 py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink/40" />
        </form>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-ink/80 ml-auto">
          <Link to="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <Link to="/vendors" className="hover:text-ink transition-colors">Stalls</Link>

          {user?.role === 'vendor' && (
            <Link to="/vendor" className="flex items-center gap-1 hover:text-ink transition-colors">
              <Store className="w-4 h-4" /> Vendor
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1 hover:text-ink transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-parchment-dim rounded-full px-3 py-1 flex items-center gap-1">
                <User className="w-3 h-3" /> {user.name}
              </span>
              <button onClick={logout} className="text-ink/60 hover:text-ink underline underline-offset-2">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => login('customer')} className="hover:text-ink">Sign in</button>
              <span className="text-ink/20">|</span>
              <button
                onClick={() => login('vendor')}
                className="text-marigold hover:text-clay font-semibold"
              >
                Sell on Bazaar
              </button>
            </div>
          )}

          <Link to="/cart" className="relative flex items-center gap-1 hover:text-ink transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-clay text-linen text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {count}
              </span>
            )}
          </Link>
        </nav>

        <button className="md:hidden ml-auto" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-ink/10 pt-3">
          <form onSubmit={submitSearch} className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search stalls, makers, goods…"
              className="w-full rounded-full border border-ink/15 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-marigold"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink/40" />
          </form>
          <Link to="/shop" onClick={() => setOpen(false)} className="py-1">Shop</Link>
          <Link to="/vendors" onClick={() => setOpen(false)} className="py-1">Stalls</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="py-1">Cart ({count})</Link>
          {user?.role === 'vendor' && <Link to="/vendor" onClick={() => setOpen(false)} className="py-1">Vendor dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} className="py-1">Admin panel</Link>}
          {user ? (
            <button onClick={logout} className="text-left py-1 text-ink/60">Sign out</button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => login('customer')} className="py-1">Sign in</button>
              <button onClick={() => login('vendor')} className="py-1 text-marigold font-semibold">Sell on Bazaar</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
