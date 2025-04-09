import express from 'express';
const router = express.Router();
import { Register } from '../controllers/Usercontroller.js';
import { Login } from '../controllers/Usercontroller.js';
import { Checkuser } from '../controllers/Usercontroller.js';

router.post('/register', Register);
router.post('/login', Login);
router.get('/auth', Checkuser);

export default router;