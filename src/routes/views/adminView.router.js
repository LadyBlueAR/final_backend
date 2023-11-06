import { Router } from 'express';
import RolesConfig from '../../middlewares/roles.middleware.js';
import { userModel } from '../../dao/mongo/models/user.model.js';

const router = new Router();

router.get('/', RolesConfig.Authorize('admin'), async (req, res) => {
    const allUsers = await userModel.find().lean();
    const users = allUsers.filter (user => user.rol !== "admin");
    res.render('admin', {users});
})

export default router;
