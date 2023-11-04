import { Router } from 'express';
import CartsController from '../controllers/carts.controller.js';
import RolesConfig from '../middlewares/roles.middleware.js';

const router = Router();



router.get('/', CartsController.getAllCarts);
router.get('/:cid', CartsController.getCartById);
router.get('/:cid/purchase', CartsController.purchaseCart);

router.post('/createCart', CartsController.createCart);
router.post('/:cid/products/:pid', RolesConfig.Authorize(["user", "premium"]), CartsController.addProductToCart);


router.put('/:cid/products/:pid', CartsController.updateProductInCart);

router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart);
router.delete('/:cid', CartsController.deleteCart);

export default router;