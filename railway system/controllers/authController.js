
import {registerUser,loginUser} from '../services/authService.js'

export const register=async (req,res,next)=>{
    try{
        const { user_name, email, password } = req.body;
        if (!user_name || !email || !password) {
            throw new Error("All fields are required");
        }

        const user=await registerUser({ user_name, email, password });
        res.json({ success: true,
            data: user });
    }catch(err){
        next(err);
    }
};

export const login=async(req,res,next)=>{
    try{
        const { email, password }=req.body;
        if(!email || !password){
            throw new Error("Email and Password are required");
        }
        const data=await loginUser({ email, password });
        res.json({ success: true, data:{
            token: data.token }
        });
    }catch(err){
        next(err);
    }
}



