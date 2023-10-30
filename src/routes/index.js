import { Router } from "express";
import sessionRouter from "./sessions.router.js";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import mockingRouter from "./mockingProducts.router.js";
import loggerTest from "./loggerTest.router.js";


const router = Router();

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/sessions', sessionRouter);
router.use('/mockingproducts', mockingRouter);
router.use('/loggerTest', loggerTest);

router.post('/products', (req, res) => {
    res.send("Producto agregado al carrito");
})
export default router;