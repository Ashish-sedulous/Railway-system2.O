import jwt from 'jsonwebtoken'

export const authentication=async(req ,res ,next)=>{
    try{
        const token=req.headers.authorization?.split(' ')[1];

    if(!token){
        throw new Error("No Token Provided");
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    req.user=decoded;
    next();
    }catch(err){
        res.status(401).json({ error: "Unauthorized" });
    }
};
