import express from 'express'
import { fetchtrains } from '../controllers/trainController.js'

const router=express.Router();

router.get('/',fetchtrains);

export default router;
