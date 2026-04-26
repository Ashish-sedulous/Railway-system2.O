import { getSeatByScheduleId } from "../services/seatServices.js";

export const fetchseats= async(req,res,next)=>{
    try{
        const { scheduleId }=req.query;

        if(!scheduleId){
            throw new Error("scheduleId is required");
        }

        const seats=await getSeatByScheduleId(scheduleId);
        res.json({
            success: true,
            data: seats
        });
    }catch (err){
        next(err);
    };
}