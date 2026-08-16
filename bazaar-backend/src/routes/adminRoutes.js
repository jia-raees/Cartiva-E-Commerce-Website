import { Router } from 'express';
import { getAdminStats, getCustomers, getVendorStats } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/admin/stats', protect, restrictTo('admin'), getAdminStats);
router.get('/admin/customers', protect, restrictTo('admin'), getCustomers);
router.get('/vendor/stats', protect, restrictTo('vendor'), getVendorStats);

export default router;
