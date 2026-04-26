import express from 'express'
import { fetchseats } from '../controllers/seatController.js';

const router=express.Router();

router.get('/',fetchseats);

export default router;
