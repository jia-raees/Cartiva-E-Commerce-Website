import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Market-wide dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
export const getAdminStats = asyncHandler(async (req, res) => {
  const [orders, vendorCount, customerCount] = await Promise.all([
    Order.find().populate('vendorId', 'name').sort({ date: -1 }),
    Vendor.countDocuments(),
    User.countDocuments({ role: 'customer' }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const topVendors = await Vendor.find().sort({ rating: -1 }).limit(5);

  res.json({
    success: true,
    stats: {
      revenue,
      vendorCount,
      orderCount: orders.length,
      customerCount,
    },
    latestOrders: orders.slice(0, 7),
    topVendors,
  });
});

// @desc    Customer directory with order counts and lifetime spend
// @route   GET /api/admin/customers
// @access  Private (admin)
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('name email createdAt');

  const spendByCustomer = await Order.aggregate([
    { $group: { _id: '$customer', orders: { $sum: 1 }, spent: { $sum: '$total' } } },
  ]);
  const spendMap = new Map(spendByCustomer.map((s) => [String(s._id), s]));

  const result = customers.map((c) => {
    const agg = spendMap.get(String(c._id));
    return {
      id: c._id,
      name: c.name,
      email: c.email,
      orders: agg?.orders || 0,
      spent: agg?.spent || 0,
    };
  });

  res.json({ success: true, count: result.length, customers: result });
});

// @desc    Vendor stall dashboard stats
// @route   GET /api/vendor/stats
// @access  Private (vendor)
export const getVendorStats = asyncHandler(async (req, res) => {
  const vendorId = req.user.vendorId;
  const [orders, products, vendor] = await Promise.all([
    Order.find({ vendorId }).sort({ date: -1 }),
    Product.find({ vendorId }),
    Vendor.findById(vendorId),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  res.json({
    success: true,
    stats: {
      revenue,
      orderCount: orders.length,
      productCount: products.length,
      rating: vendor?.rating || 0,
      reviews: vendor?.reviews || 0,
      stallNo: vendor?.stallNo,
    },
    recentOrders: orders.slice(0, 6),
  });
});
