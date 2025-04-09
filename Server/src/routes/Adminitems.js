import express from 'express';
const router = express.Router();
import { getItems } from '../controllers/Adminitemcontroller.js';
import { addItem } from '../controllers/Adminitemcontroller.js';

router.post('/getitems', getItems)

router.post('/additems', addItem)

export default router;