import jwt from 'jsonwebtoken'
export const verifyToken=async (req,res,next)=>{
    const token=req.cookies.jwt;
    if(!token){
        return res.status(401).send("You are not authenticated")
    }
     jwt.verify(token,process.env.JWT_KEY,async (error,payload)=>{
        if(error){
            return res.status(401).send("You are not authenticatec")
        }
        req.userId=payload.userId,
        req.email=payload.email
        next();
     })
}