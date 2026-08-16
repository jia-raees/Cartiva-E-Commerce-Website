import { useParams, Link } from 'react-router-dom';
import { Star, BadgeCheck, MapPin, Calendar } from 'lucide-react';
import { getVendor } from '../../data/vendors';
import { productsByVendor } from '../../data/products';
import { formatDate } from '../../utils/format';
import ProductCard from '../../components/ProductCard';

export default function VendorStore() {
  const { id } = useParams();
  const vendor = getVendor(id);
  const items = productsByVendor(id);

  if (!vendor) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-2xl mb-3">This stall has packed up.</p>
        <Link to="/vendors" className="text-clay underline underline-offset-2">Back to directory</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="h-40 sm:h-56" style={{ background: vendor.banner }} />
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-16">
        <div className="bg-white rounded-2xl border border-ink/10 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="stall-number text-xs text-clay">Stall №{vendor.stallNo}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-1 flex items-center gap-2">
                {vendor.name} {vendor.verified && <BadgeCheck className="w-6 h-6 text-teal" />}
              </h1>
              <p className="text-ink/60 mt-1">{vendor.tagline}</p>
            </div>
            <div className="flex flex-col items-end text-sm text-ink/60 gap-1">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-marigold text-marigold" /> {vendor.rating} · {vendor.reviews} reviews</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vendor.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Trading since {formatDate(vendor.joined)}</span>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-ink mt-10 mb-5">
          Goods from this stall ({items.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
