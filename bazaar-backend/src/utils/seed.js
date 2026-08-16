// Seeds (or destroys) demo data matching the original frontend mock data:
// 6 vendors, 18 products, 5 categories, 3 demo accounts (customer/vendor/admin),
// and a batch of sample orders.
//
// Usage:
//   npm run seed            populate the database
//   npm run seed:destroy    wipe all collections

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

const CATEGORY_NAMES = ['Home & Textiles', 'Food & Drink', 'Kitchen', 'Outdoor', 'Stationery'];

const VENDOR_SEEDS = [
  // Note: bannerImage/logo are left blank on purpose for most stalls, so the
  // frontend's fallback (the `banner` gradient + initial-letter avatar) is
  // exercised. A couple of stalls have a bannerImage set to show the
  // image-URL path also working end-to-end.
  { name: 'Thistle & Loom', tagline: 'Handwoven textiles from the highlands', category: 'Home & Textiles', rating: 4.8, reviews: 312, location: 'Edinburgh, UK', verified: true, banner: 'linear-gradient(135deg, #1E5F5A, #0F2D2B)', bannerImage: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200' },
  { name: 'Copperfield Roasters', tagline: 'Small-batch coffee, roasted weekly', category: 'Food & Drink', rating: 4.9, reviews: 587, location: 'Portland, US', verified: true, banner: 'linear-gradient(135deg, #B4532A, #3D1A3F)', bannerImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200' },
  { name: 'Ferro & Ash', tagline: 'Hand-forged kitchen ironware', category: 'Kitchen', rating: 4.6, reviews: 148, location: 'Turin, IT', verified: true, banner: 'linear-gradient(135deg, #3D1A3F, #0F2D2B)' },
  { name: 'Marrow Studio', tagline: 'Ceramics thrown one at a time', category: 'Home & Textiles', rating: 4.7, reviews: 203, location: 'Kyoto, JP', verified: false, banner: 'linear-gradient(135deg, #E8A33D, #B4532A)' },
  { name: 'Northbound Supply', tagline: 'Trail-tested outdoor gear', category: 'Outdoor', rating: 4.5, reviews: 421, location: 'Denver, US', verified: true, banner: 'linear-gradient(135deg, #1E5F5A, #3D1A3F)' },
  { name: 'Paper Cove', tagline: 'Letterpress stationery & prints', category: 'Stationery', rating: 4.9, reviews: 96, location: 'Melbourne, AU', verified: true, banner: 'linear-gradient(135deg, #B4532A, #E8A33D)' },
];

const PALETTE = ['#1E5F5A', '#B4532A', '#3D1A3F', '#E8A33D', '#0F2D2B', '#C97A2B'];

const PRODUCT_SEEDS = [
  ['Wool Lambswool Throw', 0, 'Home & Textiles', 78],
  ['Herringbone Table Runner', 0, 'Home & Textiles', 34],
  ['Highland Wool Cushion', 0, 'Home & Textiles', 42],
  ['Ethiopia Yirgacheffe, 250g', 1, 'Food & Drink', 16],
  ['Sumatra Dark Roast, 250g', 1, 'Food & Drink', 15],
  ['Colombia Espresso Blend', 1, 'Food & Drink', 17],
  ['Cast Iron Skillet, 10in', 2, 'Kitchen', 64],
  ['Forged Chef Knife', 2, 'Kitchen', 149],
  ['Copper Sauté Pan', 2, 'Kitchen', 118],
  ['Stoneware Dinner Plate Set', 3, 'Home & Textiles', 96],
  ['Speckled Ceramic Mug', 3, 'Home & Textiles', 22],
  ['Wabi Vase, Small', 3, 'Home & Textiles', 58],
  ['Merino Trail Base Layer', 4, 'Outdoor', 62],
  ['48L Trekking Pack', 4, 'Outdoor', 184],
  ['Titanium Camp Stove', 4, 'Outdoor', 74],
  ['Letterpress Notebook, A5', 5, 'Stationery', 24],
  ['Botanical Print Set of 3', 5, 'Stationery', 38],
  ['Wax Seal Kit', 5, 'Stationery', 29],
];

const CUSTOMER_NAMES = [
  ['A. Whitfield', 'a.whitfield@example.com'],
  ['R. Novak', 'r.novak@example.com'],
  ['M. Ibarra', 'm.ibarra@example.com'],
  ['S. Delacroix', 's.delacroix@example.com'],
  ['J. Okafor', 'j.okafor@example.com'],
  ['T. Lindqvist', 't.lindqvist@example.com'],
  ['P. Andrade', 'p.andrade@example.com'],
  ['H. Kobayashi', 'h.kobayashi@example.com'],
  ['E. Marsh', 'e.marsh@example.com'],
  ['D. Osei', 'd.osei@example.com'],
];

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

async function destroy() {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Vendor.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    Order.deleteMany(),
  ]);
  console.log('All collections wiped.');
  await mongoose.disconnect();
}

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Vendor.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    Order.deleteMany(),
  ]);

  const categories = await Category.insertMany(CATEGORY_NAMES.map((name) => ({ name })));

  const vendors = [];
  for (let i = 0; i < VENDOR_SEEDS.length; i++) {
    const v = VENDOR_SEEDS[i];
    const vendor = await Vendor.create({ ...v, stallNo: String(i + 1).padStart(3, '0') });
    vendors.push(vendor);
  }

  const products = [];
  for (let i = 0; i < PRODUCT_SEEDS.length; i++) {
    const [name, vendorIdx, category, price] = PRODUCT_SEEDS[i];
    const product = await Product.create({
      name,
      vendorId: vendors[vendorIdx]._id,
      category,
      price,
      color: PALETTE[i % PALETTE.length],
      // Left blank for most products on purpose, so the color-swatch
      // fallback is exercised. First product of each vendor gets a sample
      // image URL to show the image path also works end-to-end.
      image: i % 3 === 0 ? `https://source.unsplash.com/400x400/?${encodeURIComponent(category)}&sig=${i}` : '',
      rating: (4.2 + ((i * 7) % 8) / 10).toFixed(1),
      reviews: 12 + ((i * 37) % 400),
      stock: (i * 5) % 40,
      sku: `BZ-${1000 + i}`,
    });
    products.push(product);
  }

  // Demo accounts
  const adminUser = await User.create({ name: 'Priya Anand', email: 'admin@bazaar.app', password: 'password123', role: 'admin' });
  const customerUser = await User.create({ name: 'Elena Marsh', email: 'elena@example.com', password: 'password123', role: 'customer' });
  const vendorUser = await User.create({
    name: 'Thistle & Loom',
    email: 'shop@thistleandloom.com',
    password: 'password123',
    role: 'vendor',
    vendorId: vendors[0]._id,
  });
  vendors[0].owner = vendorUser._id;
  await vendors[0].save();

  // Extra customer accounts backing the sample orders below
  const customerUsers = [customerUser];
  for (const [name, email] of CUSTOMER_NAMES) {
    const u = await User.create({ name, email, password: 'password123', role: 'customer' });
    customerUsers.push(u);
  }

  // Sample orders
  for (let i = 0; i < 24; i++) {
    const product = products[i % products.length];
    const qty = 1 + (i % 3);
    const status = STATUSES[i % STATUSES.length];
    const day = 28 - (i % 27);
    const customer = customerUsers[(i % customerUsers.length)];
    const subtotal = qty * product.price;

    await Order.create({
      customer: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      vendorId: product.vendorId,
      items: [{ productId: product._id, name: product.name, qty, price: product.price }],
      subtotal,
      shippingCost: 6.5,
      total: subtotal + 6.5,
      shippingAddress: {
        fullName: customer.name,
        email: customer.email,
        street: '12 Lantern Row',
        city: 'Karachi',
        postalCode: '75500',
      },
      status,
      date: new Date(`2026-07-${String(day).padStart(2, '0')}`),
    });
  }

  console.log('Seed complete:');
  console.log(`  ${categories.length} categories`);
  console.log(`  ${vendors.length} vendors`);
  console.log(`  ${products.length} products`);
  console.log(`  ${customerUsers.length + 2} users`);
  console.log('  24 orders');
  console.log('\nDemo logins (password: password123):');
  console.log(`  Admin:    ${adminUser.email}`);
  console.log(`  Vendor:   ${vendorUser.email}`);
  console.log(`  Customer: ${customerUser.email}`);

  await mongoose.disconnect();
}

const shouldDestroy = process.argv.includes('--destroy');
(shouldDestroy ? destroy() : seed()).catch((err) => {
  console.error(err);
  process.exit(1);
});
