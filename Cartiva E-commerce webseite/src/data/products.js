export const categories = [
  'Home & Textiles',
  'Food & Drink',
  'Kitchen',
  'Outdoor',
  'Stationery',
];

const palette = [
  '#1E5F5A', '#B4532A', '#3D1A3F', '#E8A33D', '#0F2D2B', '#C97A2B',
];

const names = [
  ['Wool Lambswool Throw', 'v1', 'Home & Textiles', 78, '1608158222851-af032106bca9'],
  ['Herringbone Table Runner', 'v1', 'Home & Textiles', 34, '1758810741403-194444e8447f'],
  ['Highland Wool Cushion', 'v1', 'Home & Textiles', 42, '1592789705501-f9ae4278a9c9'],
  ['Ethiopia Yirgacheffe, 250g', 'v2', 'Food & Drink', 16, '1447933601403-0c6688de566e'],
  ['Sumatra Dark Roast, 250g', 'v2', 'Food & Drink', 15, '1513530176992-0cf39c4cbed4'],
  ['Colombia Espresso Blend', 'v2', 'Food & Drink', 17, '1580933073521-dc49ac0d4e6a'],
  ['Cast Iron Skillet, 10in', 'v3', 'Kitchen', 64, '1637739699971-7d4d5194e75c'],
  ['Forged Chef Knife', 'v3', 'Kitchen', 149, '1544965838-54ef8406f868'],
  ['Copper Sauté Pan', 'v3', 'Kitchen', 118, '1551905445-85602af27f47'],
  ['Stoneware Dinner Plate Set', 'v4', 'Home & Textiles', 96, '1589051088132-06f36a22012a'],
  ['Speckled Ceramic Mug', 'v4', 'Home & Textiles', 22, '1590422749897-47036da0b0ff'],
  ['Wabi Vase, Small', 'v4', 'Home & Textiles', 58, '1597696929736-6d13bed8e6a8'],
  ['Merino Trail Base Layer', 'v5', 'Outdoor', 62, '1440186347098-386b7459ad6b'],
  ['48L Trekking Pack', 'v5', 'Outdoor', 184, '1509762774605-f07235a08f1f'],
  ['Titanium Camp Stove', 'v5', 'Outdoor', 74, '1749496600182-a4c4ca08dd8e'],
  ['Letterpress Notebook, A5', 'v6', 'Stationery', 24, '1639371040157-55b642d03f4f'],
  ['Botanical Print Set of 3', 'v6', 'Stationery', 38, '1726345877328-0eb6398cdf9b'],
  ['Wax Seal Kit', 'v6', 'Stationery', 29, '1646568779353-b9d2b903b3e1'],
];

export const products = names.map((n, i) => ({
  id: `p${i + 1}`,
  name: n[0],
  vendorId: n[1],
  category: n[2],
  price: n[3],
  color: palette[i % palette.length],
  image: `https://images.unsplash.com/photo-${n[4]}?w=800&h=800&fit=crop&auto=format&q=80`,
  rating: (4.2 + ((i * 7) % 8) / 10).toFixed(1),
  reviews: 12 + ((i * 37) % 400),
  stock: (i * 5) % 40,
  description:
    'Made in small batches with materials sourced directly from the maker\'s regular suppliers. Every piece varies slightly — that\'s the nature of handmade work.',
  sku: `BZ-${1000 + i}`,
}));

export const getProduct = (id) => products.find((p) => p.id === id);
export const productsByVendor = (vendorId) =>
  products.filter((p) => p.vendorId === vendorId);
