import { getalltrains } from "../services/trainServices.js";

export const fetchtrains= async (req,res,next)=>{
    try{
        const trains=await getalltrains();
        res.json({
            success: true,
            data: trains
        });
    }catch (err){
        next(err);
    }
};