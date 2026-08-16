import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    List categories with product counts
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));

  res.json({
    success: true,
    categories: categories.map((c) => ({ id: c._id, name: c.name, count: countMap[c.name] || 0 })),
  });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) throw new ApiError(400, 'Category name is required');

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) throw new ApiError(409, 'Category already exists');

  const category = await Category.create({ name: name.trim() });
  res.status(201).json({ success: true, category });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
