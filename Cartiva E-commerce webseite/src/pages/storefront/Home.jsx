import { Link } from 'react-router-dom';
import { ArrowRight, Store, Truck, ShieldCheck } from 'lucide-react';
import { products } from '../../data/products';
import { vendors } from '../../data/vendors';
import ProductCard from '../../components/ProductCard';
import VendorCard from '../../components/VendorCard';
import AIRecommendations from '../../components/AIRecommendations';
import { getPersonalizedRecommendations, getTopViewedCategory } from '../../utils/recommendations';

export default function Home() {
  const featured = products.slice(0, 8);
  const stalls = vendors.slice(0, 3);
  const recommended = getPersonalizedRecommendations(products, 4);
  const topCategory = getTopViewedCategory(products);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-linen">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, var(--color-marigold) 0, transparent 35%), radial-gradient(circle at 80% 70%, var(--color-clay) 0, transparent 40%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 relative">
          <div className="stall-number text-marigold text-sm mb-4">6 CATEGORIES · 6 STALLS OPEN TODAY</div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] max-w-2xl">
            One market, every maker keeps their own counter.
          </h1>
          <p className="mt-5 text-parchment/70 max-w-lg text-lg">
            Bazaar gathers independent vendors under one roof — browse by stall, not by algorithm.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="bg-marigold text-ink font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-marigold-soft transition-colors">
              Browse the market <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/vendors" className="border border-linen/30 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-linen/10 transition-colors">
              <Store className="w-4 h-4" /> Meet the stalls
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-ink/10 bg-parchment">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-clay" />
            <span>Independent vendors, individually vetted</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-clay" />
            <span>Shipped directly from each stall</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-clay" />
            <span>Buyer protection on every order</span>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="stall-number text-clay text-xs mb-1">TODAY'S SELECTION</div>
            <h2 className="font-display text-3xl font-semibold text-ink">Fresh from the stalls</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-clay hover:text-ink flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* AI-powered recommendations */}
      {recommended.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <AIRecommendations
            title="Recommended for you"
            subtitle={
              topCategory
                ? `Because you've been browsing ${topCategory}`
                : "Popular picks to help you start browsing"
            }
            products={recommended}
            titleSize="text-3xl"
          />
        </section>
      )}

      {/* Featured vendors */}
      <section className="bg-parchment py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="stall-number text-clay text-xs mb-1">MEET THE MAKERS</div>
              <h2 className="font-display text-3xl font-semibold text-ink">Stalls worth a visit</h2>
            </div>
            <Link to="/vendors" className="text-sm font-medium text-clay hover:text-ink flex items-center gap-1">
              All stalls <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stalls.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
