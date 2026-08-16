import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, restrictTo('vendor', 'admin'), createProduct);
router.put('/:id', protect, restrictTo('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, restrictTo('vendor', 'admin'), deleteProduct);

export default router;
