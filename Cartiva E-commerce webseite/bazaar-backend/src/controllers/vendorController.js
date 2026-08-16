import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';

// @desc    List all vendors
// @route   GET /api/vendors
// @access  Public
export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  res.json({ success: true, count: vendors.length, vendors });
});

// @desc    Get a single vendor
// @route   GET /api/vendors/:id
// @access  Public
export const getVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) throw new ApiError(404, 'Vendor not found');
  res.json({ success: true, vendor });
});

// @desc    Update a vendor's store settings
// @route   PUT /api/vendors/:id
// @access  Private (owning vendor, admin)
export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) throw new ApiError(404, 'Vendor not found');

  const isOwner = req.user.role === 'vendor' && String(vendor._id) === String(req.user.vendorId);
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to edit this store');
  }

  const { name, tagline, location, category, bannerImage, logo } = req.body;
  if (name !== undefined) vendor.name = name;
  if (tagline !== undefined) vendor.tagline = tagline;
  if (location !== undefined) vendor.location = location;
  if (category !== undefined) vendor.category = category;
  if (bannerImage !== undefined) vendor.bannerImage = bannerImage;
  if (logo !== undefined) vendor.logo = logo;

  await vendor.save();
  res.json({ success: true, vendor });
});

// @desc    Suspend or reactivate a vendor
// @route   PATCH /api/vendors/:id/status
// @access  Private (admin)
export const setVendorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Active', 'Suspended'].includes(status)) {
    throw new ApiError(400, 'status must be "Active" or "Suspended"');
  }

  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) throw new ApiError(404, 'Vendor not found');

  vendor.status = status;
  await vendor.save();
  res.json({ success: true, vendor });
});

// @desc    List a vendor's products
// @route   GET /api/vendors/:id/products
// @access  Public
export const getVendorProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendorId: req.params.id }).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
});
