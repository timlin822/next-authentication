import jwt from 'jsonwebtoken'

import User from 'models/userModel'

const checkAuth=async(req,res)=>{
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            const token=req.headers.authorization.split(" ")[1]
            
            // Token Access
            const verify=jwt.verify(token,process.env.JWT_SECRET)
            if(!verify){
                return res.status(401).json({
                    message: "Token驗證錯誤"
                })
            }
            
            const user=await User.findById(verify.id).select("_id username email role")
            if(!user){
                return res.status(401).json({
                    message: "沒有User"
                })
            }
            return user
        }
        else{
            return res.status(401).json({
                message: "沒有Token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message: err
        })
    }
}

export default checkAuth