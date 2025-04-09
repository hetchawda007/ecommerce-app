import express from 'express';
import { Register, getAdmins, Login, Checkuser } from '../controllers/Admincontroller.js';

const router = express.Router();


router.get('/auth', Checkuser)

router.post('/login', Login);

router.post('/register', Register)

router.get("/getadmins", getAdmins)

export default router;