import { Router } from 'express';
import CartsController from '../controllers/carts.controller.js';

const router = Router();



router.get('/', CartsController.getAllCarts);
router.get('/:cid', CartsController.getCartById);

router.post('/createCart', CartsController.createCart);
router.post('/:cid/products/:pid', CartsController.addProductToCart);
router.post('/:cid/purchase', CartsController.purchaseCart);

router.put('/:cid/products/:pid', CartsController.updateProductInCart);

router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart);
router.delete('/:cid', CartsController.deleteCart);

export default router;