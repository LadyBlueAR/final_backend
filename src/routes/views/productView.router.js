import { Router } from 'express';
import { productModel } from '../../dao/mongo/models/products.model.js';
import RolesConfig from '../../middlewares/roles.middleware.js';


const router = new Router();

router.get('/', async (req, res) => {
    const user = req.session.user;
    if(user) {
       let prevLink = null;
       let nextLink = null;
   
       const limit = req.query.limit || 5;
       const page = req.query.page || 1;
   
       const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest} =
       await productModel.paginate({}, {limit, page, lean: true});
       const products = docs;
       if (hasPrevPage) prevLink = `https://ecommerce-coder-guet.onrender.com/products?limit=${limit}&page=${parseInt(page)-1}`;
       if (hasNextPage) nextLink = `https://ecommerce-coder-guet.onrender.com/products?limit=${limit}&page=${parseInt(page)+1}`;
       res.render('products', {user, products, hasPrevPage, hasNextPage, prevLink, nextLink});
    } else {
        res.status(404).json({error: "usuario no encontrado"});
    }
})

router.get('/create', RolesConfig.Authorize(['admin','premium']), async (req, res) => {
    res.render('createProduct');
})

export default router;
