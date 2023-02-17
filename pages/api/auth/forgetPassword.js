import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import db from 'config/db'
import User from 'models/userModel'

db()

export default async(req,res)=>{
    switch(req.method){
        case "POST":
            await forgetPassword(req,res)
            break
    }
}

// 忘記密碼
const forgetPassword=async(req,res)=>{
    try{
        const {email}=req.body
        const emailPattern=/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        
		// 檢查全部欄位是否填寫
        if(!email){
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
        // 檢查帳號是否存在
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "Email不存在"
            })
        }

        // JWT Token
        const resetToken=jwt.sign({id: user._id},process.env.JWT_FORGET_PASSWORD,{expiresIn: 10*60}) //10分鐘

        if(user && resetToken){
            let transporter=nodemailer.createTransport({
                service: "Gmail",
                auth:{
                    user: process.env.SEND_EMAIL,
                    pass: process.env.SEND_EMAIL_PASSWORD
                }
            })
    
            let mailOptions={
                from: "noreply@gmail.com",
                to: email,
                subject: "重設密碼",
                html: `
                    <p>請在10分鐘內點擊連結，重設密碼</p><br/>
                    <a href="http://localhost:3000/resetPassword/${resetToken}">點擊連結</a>
                `
            }
            await transporter.sendMail(mailOptions)
        }
        res.status(201).json({
            message: "請前往Email信箱，進行密碼重設"
        })
    }
    catch(err){
        res.status(500).json({
            message: "寄信權限不足"
        })
    }
}