import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';

// @desc    List products with optional search/filter/sort
// @route   GET /api/products?q=&category=&maxPrice=&vendorId=&sort=
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { q, category, maxPrice, vendorId, sort } = req.query;

  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category && category !== 'All') filter.category = category;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };
  if (vendorId) filter.vendorId = vendorId;

  let sortSpec = { createdAt: -1 };
  if (sort === 'price-asc') sortSpec = { price: 1 };
  if (sort === 'price-desc') sortSpec = { price: -1 };
  if (sort === 'rating') sortSpec = { rating: -1 };

  const products = await Product.find(filter).sort(sortSpec);
  res.json({ success: true, count: products.length, products });
});

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

// @desc    Create a product (vendor for their own stall, or admin for any stall)
// @route   POST /api/products
// @access  Private (vendor, admin)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock, description, color, image } = req.body;

  if (!name || !category || price === undefined) {
    throw new ApiError(400, 'name, category and price are required');
  }

  const vendorId = req.user.role === 'admin' && req.body.vendorId ? req.body.vendorId : req.user.vendorId;
  if (!vendorId) throw new ApiError(400, 'No vendor stall associated with this account');

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new ApiError(404, 'Vendor not found');

  const product = await Product.create({
    name,
    category,
    price: Number(price),
    stock: Number(stock) || 0,
    description,
    color,
    image,
    vendorId,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (owning vendor, admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const isOwner = req.user.role === 'vendor' && String(product.vendorId) === String(req.user.vendorId);
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to edit this product');
  }

  const { name, category, price, stock, description, color, image } = req.body;
  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (description !== undefined) product.description = description;
  if (color !== undefined) product.color = color;
  if (image !== undefined) product.image = image;

  await product.save();
  res.json({ success: true, product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (owning vendor, admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const isOwner = req.user.role === 'vendor' && String(product.vendorId) === String(req.user.vendorId);
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to delete this product');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});
