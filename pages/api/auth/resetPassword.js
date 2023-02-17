import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from 'config/db'
import User from 'models/userModel'
import dateTime from 'utils/dateTime'

db()

export default async(req,res)=>{
    switch(req.method){
        case "POST":
            await resetPassword(req,res)
            break
    }
}

// 重設密碼
const resetPassword=async(req,res)=>{
    try{
        const {resetToken,newPassword,confirmNewPassword}=req.body
        const passwordPattern=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
		
		// 檢查全部欄位是否填寫
        if(!resetToken || !newPassword || !confirmNewPassword){
			return res.status(400).json({
                message: "請填寫完整"
            })
        }
        // 檢查新密碼長度是否大於8個字元
        if(newPassword.length<8){
			return res.status(400).json({
                message: "請填寫至少8個字元"
            })
        }
		// 檢查新密碼格式是否符合
		if(!newPassword.match(passwordPattern)){
            return res.status(400).json({
                message: "請填寫至少包括1個大寫字元、1個小寫字元、1個數字、1個特殊字元"
            })
		}
        // 檢查新密碼是否一致
        if(newPassword!==confirmNewPassword){
            return res.status(400).json({
                message: "密碼不一致"
            })
		}

        // Token Access
        const verify=jwt.verify(resetToken,process.env.JWT_FORGET_PASSWORD)
        if(!verify){
            return res.status(401).json({
                message: "已超過時間"
            })
        }

        // 檢查帳號是否存在
        const user=await User.findById(verify.id)
        if(!user){
            return res.status(400).json({
                message: "此Email不存在"
            })
        }

        // 加密
        const salt=await bcrypt.genSalt()
        const passwordHash=await bcrypt.hash(newPassword,salt)

        // 更新password
        await User.findByIdAndUpdate(user._id,{password: passwordHash,updateAt: dateTime()},{new: true})
        
        res.status(201).json({
            message: "密碼重設成功，請重新登入"
        })
    }
    catch(err){
        res.status(500).json({
            message: "無法重設密碼"
        })
    }
}