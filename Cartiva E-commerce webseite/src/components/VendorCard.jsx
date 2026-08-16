import { Link } from 'react-router-dom';
import { Star, BadgeCheck, MapPin } from 'lucide-react';

export default function VendorCard({ vendor }) {
  return (
    <Link
      to={`/vendors/${vendor.id}`}
      className="group block rounded-2xl overflow-hidden border border-ink/10 bg-white hover:shadow-lg hover:shadow-ink/5 hover:border-marigold/60 transition-all"
    >
      <div
        className="h-24 relative flex items-end p-4"
        style={{ background: vendor.banner }}
      >
        <span className="stall-number text-linen/80 text-xs bg-black/20 rounded-full px-2 py-0.5">
          Stall №{vendor.stallNo}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-lg font-semibold text-ink group-hover:text-clay transition-colors">
            {vendor.name}
          </h3>
          {vendor.verified && <BadgeCheck className="w-4 h-4 text-teal" />}
        </div>
        <p className="text-sm text-ink/60 mt-0.5">{vendor.tagline}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-ink/50">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {vendor.location}</span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-marigold text-marigold" /> {vendor.rating} ({vendor.reviews})
          </span>
        </div>
      </div>
    </Link>
  );
}
