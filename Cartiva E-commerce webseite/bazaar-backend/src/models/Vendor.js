import mongoose from 'mongoose';

const PALETTE = [
  ['#1E5F5A', '#0F2D2B'],
  ['#B4532A', '#3D1A3F'],
  ['#3D1A3F', '#0F2D2B'],
  ['#E8A33D', '#B4532A'],
  ['#1E5F5A', '#3D1A3F'],
  ['#B4532A', '#E8A33D'],
];

export function randomBanner() {
  const [a, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

const vendorSchema = new mongoose.Schema(
  {
    stallNo: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    joined: { type: Date, default: Date.now },
    location: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    banner: { type: String, default: randomBanner },
    // Optional image URLs. When empty, the frontend falls back to the
    // generated `banner` gradient and an initial-letter avatar.
    bannerImage: { type: String, default: '', trim: true },
    logo: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-assign a sequential, zero-padded stall number, e.g. "001", "002"...
vendorSchema.pre('save', async function assignStallNo(next) {
  if (this.stallNo) return next();
  const count = await mongoose.model('Vendor').countDocuments();
  this.stallNo = String(count + 1).padStart(3, '0');
  next();
});

export default mongoose.model('Vendor', vendorSchema);
