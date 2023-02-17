import db from 'config/db'
import checkAuth from 'middleware/checkAuthMiddle'

db()

export default async(req,res)=>{
    switch(req.method){
        case "GET":
            await checkLogin(req,res)
            break
    }
}

// Check Login
const checkLogin=async(req,res)=>{
    try{
        const user=await checkAuth(req,res)
        
        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
				role: user.role
            }
        })
    }
    catch(err){
        res.status(500).json({
            message: err
        })
    }
}