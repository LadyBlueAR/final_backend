import { Router } from 'express';
import productView from './views/productView.router.js';
import userView from './views/userView.router.js';
import cartsView from './views/cartsView.router.js';
import adminView from './views/adminView.router.js';
import SessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.use('/', userView);
router.use('/products', productView);
router.use('/carts', cartsView);
router.use('/admin', adminView);

//General routes
router.get('/', async (req, res) => { 
    res.render('login');
});

router.get('/current', async (req, res) => {
    try {
        const user = await SessionsController.getCurrentUser(req, res);
        if (user) {
           res.render('current', {user});
        } else {
            res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

export default router;


