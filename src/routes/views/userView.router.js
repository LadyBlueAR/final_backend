import { Router } from 'express';
import RolesConfig from '../../middlewares/roles.middleware.js';
import jwt from 'jsonwebtoken';

const router = new Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', async (req, res) => {
    res.render('login');
});
router.get('/chat', RolesConfig.Authorize('user'), (req, res) => {
    res.render('chat');
})

router.get('/reset', async (req, res) => {
    const token = req.query.token;
    jwt.verify(token, 'claveDeRecuperacion', (err, decoded) => {
        if (err) {
            res.status(500).render('invalidToken', {token});
        } else {
            res.render('reset', {token});            
        }
    })
})

router.get('/documents', async (req, res) => {
    const user = req.session.user;
    res.render('upload', {user});
});
export default router;
