import { Router } from 'express';
import { cartModel } from '../../dao/mongo/models/carts.model.js';


const router = new Router();

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid).populate('products.product').lean();
    const products = cart.products;
    let empty = false;
    if(products.length === 0) {
        const empty = true;
        res.render('cart', {cart, empty});
    } else {
        res.render ('cart', {cart, products, empty})
    }
})

export default router;
