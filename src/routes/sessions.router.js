import { Router } from 'express';
import passport from 'passport';
import SessionsController from '../controllers/sessions.controller.js';

const router = Router();


router.post('/register', passport.authenticate('register'), SessionsController.registerUser);
router.post('/login', SessionsController.loginUser);
router.post('/github', SessionsController.loginWithGithub);
router.get('/githubcallback', SessionsController.loginWithGithubCallback);
router.post('/logout', SessionsController.logoutUser);

export default router;


