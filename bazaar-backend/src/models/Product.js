import mongoose from 'mongoose';

const PALETTE = ['#1E5F5A', '#B4532A', '#3D1A3F', '#E8A33D', '#0F2D2B', '#C97A2B'];

export function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    color: { type: String, default: randomColor },
    // Optional image URL. When empty, the frontend falls back to the
    // generated `color` swatch (a colored tile with the product's initial).
    image: { type: String, default: '', trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: {
      type: String,
      default:
        "Made in small batches with materials sourced directly from the maker's regular suppliers. Every piece varies slightly — that's the nature of handmade work.",
    },
    sku: { type: String, unique: true },
  },
  { timestamps: true }
);

productSchema.pre('save', async function assignSku(next) {
  if (this.sku) return next();
  const count = await mongoose.model('Product').countDocuments();
  this.sku = `BZ-${1000 + count}`;
  next();
});

productSchema.index({ name: 'text' });

export default mongoose.model('Product', productSchema);
