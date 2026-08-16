import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';

// @desc    Register a new user (customer or vendor). Vendors also get a Vendor stall created.
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, store } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  const allowedRole = role === 'vendor' ? 'vendor' : 'customer';

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role: allowedRole });

  if (allowedRole === 'vendor') {
    const vendor = await Vendor.create({
      name: store?.name || name,
      tagline: store?.tagline || '',
      category: store?.category || 'Home & Textiles',
      location: store?.location || '',
      bannerImage: store?.bannerImage || '',
      logo: store?.logo || '',
      owner: user._id,
    });
    user.vendorId = vendor._id;
    await user.save();
  }

  const token = generateToken(user._id);
  res.status(201).json({ success: true, token, user: user.toSafeObject() });
});

// @desc    Log in and receive a JWT
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);
  res.json({ success: true, token, user: user.toSafeObject() });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});
