import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { checkDocuments } from '../middlewares/documents.middleware.js';
import { uploader } from "../middlewares/multer.middleware.js";


const router = new Router();

router.get('/', UserController.getAllUsers);

//Password
router.post('/passReset', UserController.requestPasswordReset);
router.post('/changePassword', UserController.changePassword);

//Change Role
router.put('/premium/:uid', checkDocuments, UserController.changeRole);

//Documents
router.post('/:uid/documents/profile', uploader.single('profile'), UserController.uploadSingle);
router.post('/:uid/documents/products', uploader.array('products',3), UserController.uploadMultiple);
router.post('/:uid/documents', uploader.single('documents'), UserController.uploadSingle);

//Delete Users
router.delete('/', UserController.deleteInactive);
router.delete('/:uid', UserController.deleteUser);


export default router;