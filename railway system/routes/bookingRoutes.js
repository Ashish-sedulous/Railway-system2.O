import express from 'express';
import { authentication } from '../middleware/authMiddleware.js';
import { bookTicket, getUserBooking } from '../controllers/bookingController.js';
import { cancelTicket } from '../controllers/bookingController.js';


const router=express.Router();

router.post('/book',authentication,bookTicket);
router.post('/cancel',authentication,cancelTicket);
router.get('/user',authentication,getUserBooking);

export default router;