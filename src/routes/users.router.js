import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { uploader } from "../middlewares/multer.middleware.js";


const router = new Router();

router.post('/passReset', UserController.requestPasswordReset);
router.post('/changePassword', UserController.changePassword);
router.put('/premium/:uid', UserController.changeRole);

router.post('/:uid/documents/:fileType', uploader.single('file'), UserController.uploadDoc);
export default router;