import bcrypt from 'bcrypt'

import db from 'config/db'
import User from 'models/userModel'
import dateTime from 'utils/dateTime'

db()

export default async(req,res)=>{
    switch(req.method){
        case "POST":
            await register(req,res)
            break
    }
}

// 註冊
const register=async(req,res)=>{
    try{
        const {username,email,password,confirmPassword}=req.body
        const emailPattern=/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        const passwordPattern=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
        
        // 檢查全部欄位是否填寫
        if(!username || !email || !password || !confirmPassword){
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
        // 檢查密碼與確認密碼是否一致
        if(password!==confirmPassword){
            return res.status(400).json({
                message: "密碼不一致"
            })
		}
        // 檢查帳號是否存在
        const existUser=await User.findOne({email})
        if(existUser){
            return res.status(400).json({
                message: "Email已存在"
            })
        }

        // 加密
        const salt=await bcrypt.genSalt()
        const passwordHash=await bcrypt.hash(password,salt)
        
        // 註冊
        const newUser=await User.create({username,email,password: passwordHash,createAt: dateTime(),updateAt: dateTime(),lastLoginAt: dateTime()})
		
        res.status(201).json({
            message: "註冊成功，請重新登入",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    }
    catch(err){
        res.status(500).json({
            message: err
        })
    }
}