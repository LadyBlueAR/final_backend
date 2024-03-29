import { Router } from 'express';
import ProductsController from '../controllers/products.controller.js';

const router = new Router();

router.get('/', ProductsController.getProducts);
router.get('/:pid', ProductsController.getProductById);
router.post('/create', ProductsController.createProduct);
router.put('/:pid', ProductsController.updateProduct);
router.delete('/:pid', ProductsController.deleteProduct);

export default router;