import { vendors } from '../../data/vendors';
import VendorCard from '../../components/VendorCard';

export default function VendorList() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="stall-number text-clay text-xs mb-1">DIRECTORY</div>
        <h1 className="font-display text-4xl font-semibold text-ink">All stalls</h1>
        <p className="text-ink/60 mt-1">{vendors.length} independent vendors trading today</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map((v) => (
          <VendorCard key={v.id} vendor={v} />
        ))}
      </div>
    </div>
  );
}
