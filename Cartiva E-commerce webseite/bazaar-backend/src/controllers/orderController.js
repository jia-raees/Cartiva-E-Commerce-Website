import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const SHIPPING_COST = 6.5;

// @desc    Place an order from the current cart. Splits items by vendor stall
//          into one order per vendor, decrements stock, and prices items
//          from the database (never trusts client-sent prices).
// @route   POST /api/orders
// @access  Private (customer)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Cart items are required');
  }
  const required = ['fullName', 'email', 'street', 'city', 'postalCode'];
  if (!shippingAddress || required.some((f) => !shippingAddress[f])) {
    throw new ApiError(400, 'A complete shipping address is required');
  }

  // Look up every product referenced by the cart in one query.
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  // Group requested items by vendor stall.
  const byVendor = new Map();
  for (const item of items) {
    const product = productMap.get(String(item.productId));
    if (!product) throw new ApiError(404, `Product ${item.productId} not found`);

    const qty = Number(item.qty) || 1;
    if (product.stock < qty) {
      throw new ApiError(400, `Not enough stock for "${product.name}" (${product.stock} left)`);
    }

    const vendorKey = String(product.vendorId);
    if (!byVendor.has(vendorKey)) byVendor.set(vendorKey, []);
    byVendor.get(vendorKey).push({ product, qty });
  }

  const createdOrders = [];

  for (const [vendorId, vendorItems] of byVendor) {
    const orderItems = vendorItems.map(({ product, qty }) => ({
      productId: product._id,
      name: product.name,
      qty,
      price: product.price,
    }));
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingCost = SHIPPING_COST;

    const order = await Order.create({
      customer: req.user._id,
      customerName: shippingAddress.fullName || req.user.name,
      customerEmail: shippingAddress.email || req.user.email,
      vendorId,
      items: orderItems,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      shippingAddress,
    });

    // Decrement stock for each purchased product.
    await Promise.all(
      vendorItems.map(({ product, qty }) => Product.updateOne({ _id: product._id }, { $inc: { stock: -qty } }))
    );

    createdOrders.push(order);
  }

  res.status(201).json({ success: true, orders: createdOrders });
});

// @desc    Get the logged-in customer's own orders
// @route   GET /api/orders/mine
// @access  Private (customer)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ date: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Get orders for the logged-in vendor's stall
// @route   GET /api/orders/vendor
// @access  Private (vendor)
export const getVendorOrders = asyncHandler(async (req, res) => {
  if (!req.user.vendorId) throw new ApiError(400, 'No vendor stall associated with this account');
  const filter = { vendorId: req.user.vendorId };
  if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;

  const orders = await Order.find(filter).sort({ date: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Get every order across the market
// @route   GET /api/orders
// @access  Private (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
  if (req.query.q) {
    filter.$or = [
      { orderNumber: { $regex: req.query.q, $options: 'i' } },
      { customerName: { $regex: req.query.q, $options: 'i' } },
    ];
  }

  const orders = await Order.find(filter).populate('vendorId', 'name').sort({ date: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Update an order's fulfillment status
// @route   PATCH /api/orders/:id/status
// @access  Private (owning vendor, admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!valid.includes(status)) throw new ApiError(400, `status must be one of: ${valid.join(', ')}`);

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = req.user.role === 'vendor' && String(order.vendorId) === String(req.user.vendorId);
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to update this order');
  }

  order.status = status;
  await order.save();
  res.json({ success: true, order });
});
