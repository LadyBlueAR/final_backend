import { Router } from 'express';
import CartsController from '../controllers/carts.controller.js';

const router = Router();


router.get('/', CartsController.getAllCarts);
router.get('/:cid', CartsController.getCartById);
router.get('/:cid/purchase', CartsController.purchaseCart);

router.post('/createCart', CartsController.createCart);
router.post('/addToCart/:pid', CartsController.addProductToCart);


router.put('/:cid/products/:pid', CartsController.updateProductInCart);

router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart);
router.delete('/:cid/delete', CartsController.deleteCart);

export default router;