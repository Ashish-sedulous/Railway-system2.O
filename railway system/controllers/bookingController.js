import { createBooking } from '../services/bookingServices.js';
import { cancelBooking } from '../services/bookingServices.js';
import { bookingSchema } from '../validators/bookingvalidator.js';
import { cancelSchema } from '../validators/cancelvalidator.js';
import { getBookingByUser } from '../services/bookingServices.js';

export const bookTicket= async (req,res,next)=>{
    try{
        const { error }=bookingSchema.validate(req.body);
        if(error) throw new Error(error.details[0].message);

        const userId = req.user.userId;
        const { scheduleId, amount = 500 } = req.body;
        let data;
        for(let i=0;i<3;i++)
        {
            try{
                data=await createBooking({userId,scheduleId,amount});
                break;
            }catch(err){
                if(i==2) throw err;
            }
        }
        res.json({
          success: true,
          data
        });
        
    }catch (err) {
        next(err);
    }
};

export const cancelTicket=async (req,res,next)=>{
    try{
        const { error }=cancelSchema.validate(req.body);
        if(error) throw new Error(error.details[0].message);

        const result=await cancelBooking(req.body.bookingId);
        res.json({
            success: true,
            data: result
        });
    }catch (err){
        next(err);
    }
};

export const getUserBooking=async(req,res,next)=>{
    try{
        const userId = req.user.userId;
        const bookings=await getBookingByUser(userId);
        res.json({
            success: true,
            data: bookings
        });
    }catch (err){
        next(err);
    }
}