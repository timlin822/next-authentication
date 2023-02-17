import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from 'config/db'
import User from 'models/userModel'
import dateTime from 'utils/dateTime'

db()

export default async(req,res)=>{
    switch(req.method){
        case "POST":
            await login(req,res)
            break
    }
}

// 登入
const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const emailPattern=/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        const passwordPattern=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

        // 檢查全部欄位是否填寫
        if(!email || !password){
			return res.status(400).json({
                message: "請填寫完整"
            })
        }
        // 檢查Email格式是否符合
        if(!email.match(emailPattern)){
			return res.status(400).json({
                message: "Email格式錯誤"
            })
		}
		// 檢查密碼長度是否大於8個字元
        if(password.length<8){
            return res.status(400).json({
                message: "請填寫至少8個字元"
            })
        }
		// 檢查密碼格式是否符合
		if(!password.match(passwordPattern)){
            return res.status(400).json({
                message: "請填寫至少包括1個大寫字元、1個小寫字元、1個數字、1個特殊字元"
            })
		}
        // 檢查帳號是否存在
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "Email不存在"
            })
        }
        // 比對密碼是否符合
        const checkPassword=await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({
                message: "密碼錯誤"
            })
        }

        // 更新登入時間
        await User.findByIdAndUpdate(user._id,{lastLoginAt: dateTime()},{new: true})

        // JWT Token
        const token=jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: 60*60}) //單位秒

        res.status(201).json({
            message: "登入成功",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
			token
        })
    }
    catch(err){
        res.status(500).json({
            message: err
        })
    }
}