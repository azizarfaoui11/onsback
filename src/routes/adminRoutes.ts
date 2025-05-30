import { Router, Request, Response } from 'express';
import { getAllUsers,updateUser, deleteUser,getUsersByRoleParam, getAdminStatistics, lotpermonth} from '../controllers/adminController';
import { auth } from '../middleware/auth';
import { authorizeRoles } from '../middleware/authRoles';


const router = Router();

//router.get('/getusers',auth,authorizeRoles('admin'), getAllUsers);
router.get('/getusers', getAllUsers);

router.put('/updateuser/:id',updateUser);
router.delete('/deleteuser/:id', deleteUser);
router.get('/userbyrole/:role',getUsersByRoleParam);
router.get('/stat',getAdminStatistics);
router.get('/lots-per-month',lotpermonth);





export default router; 