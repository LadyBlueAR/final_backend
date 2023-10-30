import { Router } from 'express';
import { generateProduct } from '../mocks/products.mock.js';

const router = Router();

router.get('/', (req, res) => {
        const products = [];
        for (let i = 0; i < 50 ; i++) {
          products.push(generateProduct());
        }
        res.send(products);    
});

export default router;