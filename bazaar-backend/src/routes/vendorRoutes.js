import { Router } from 'express';
import {
  getVendors,
  getVendor,
  updateVendor,
  setVendorStatus,
  getVendorProducts,
} from '../controllers/vendorController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', getVendors);
router.get('/:id', getVendor);
router.get('/:id/products', getVendorProducts);
router.put('/:id', protect, restrictTo('vendor', 'admin'), updateVendor);
router.patch('/:id/status', protect, restrictTo('admin'), setVendorStatus);

export default router;
