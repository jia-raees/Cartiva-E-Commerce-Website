import { products } from './products';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const customers = [
  'A. Whitfield', 'R. Novak', 'M. Ibarra', 'S. Delacroix', 'J. Okafor',
  'T. Lindqvist', 'P. Andrade', 'H. Kobayashi', 'E. Marsh', 'D. Osei',
];

export const orders = Array.from({ length: 24 }).map((_, i) => {
  const product = products[i % products.length];
  const qty = 1 + (i % 3);
  const status = statuses[i % statuses.length];
  const day = 28 - (i % 27);
  return {
    id: `BZ-ORD-${8801 + i}`,
    date: `2026-07-${String(day).padStart(2, '0')}`,
    customer: customers[i % customers.length],
    vendorId: product.vendorId,
    items: [{ productId: product.id, name: product.name, qty, price: product.price }],
    total: qty * product.price,
    status,
  };
});

export const ordersByVendor = (vendorId) => orders.filter((o) => o.vendorId === vendorId);
