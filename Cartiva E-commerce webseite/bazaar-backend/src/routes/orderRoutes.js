import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, restrictTo('customer'), createOrder);
router.get('/mine', protect, restrictTo('customer'), getMyOrders);
router.get('/vendor', protect, restrictTo('vendor'), getVendorOrders);
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.patch('/:id/status', protect, restrictTo('vendor', 'admin'), updateOrderStatus);

export default router;
