import {useState,useEffect,useContext} from 'react'
import {FaLock,FaEye,FaEyeSlash} from 'react-icons/fa'
import Head from 'next/head'
import {useRouter} from 'next/router'
import axios from 'axios'
import {parseCookies} from 'nookies'

import MessageContext from 'context/message/MessageContext'
import UserContext from 'context/user/UserContext'

import Error from 'components/message/Error'
import Success from 'components/message/Success'
import Loading from 'components/message/Loading'

import baseUrl from 'utils/baseUrl'

const ResetPasswordPage=()=>{
    const router=useRouter()
    const {resetToken}=router.query
	
	const {error,success,loading,clearMessage,setError}=useContext(MessageContext)
    const {resetPassword}=useContext(UserContext)

	const [userData,setUserData]=useState({
		newPassword: "",
		confirmNewPassword: ""
	})
	const {newPassword,confirmNewPassword}=userData
	const [passwordIsShow,setPasswordIsShow]=useState(false)
	const [confirmPasswordIsShow,setConfirmPasswordIsShow]=useState(false)
	
	useEffect(()=>{
		clearMessage()
	},[])
    useEffect(()=>{
		if(success==="密碼重設成功，請重新登入"){
			setUserData({
				newPassword: "",
				confirmNewPassword: ""
			})
            setTimeout(()=>{router.push("/login")},1000)
		}
	},[success])
	
	const changeHandler=(e)=>{
		clearMessage()

        setUserData({
			...userData,
			[e.target.name]: e.target.value
		})
	}

    const passwordToggleHandler=()=>{
		setPasswordIsShow(!passwordIsShow)
	}
	const confirmPasswordToggleHandler=()=>{
		setConfirmPasswordIsShow(!confirmPasswordIsShow)
	}

	const submitHandler=(e)=>{
		e.preventDefault()
		const passwordPattern=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
		
		// 檢查全部欄位是否填寫
        if(!newPassword || !confirmNewPassword){
			return setError("請填寫完整")
        }
        // 檢查新密碼長度是否大於8個字元
        if(newPassword.length<8){
			return setError("請填寫至少8個字元")
        }
		// 檢查新密碼格式是否符合
		if(!newPassword.match(passwordPattern)){
			return setError("請填寫至少包括1個大寫字元、1個小寫字元、1個數字、1個特殊字元")
		}
        // 檢查新密碼是否一致
        if(newPassword!==confirmNewPassword){
			return setError("密碼不一致")
		}

		resetPassword({resetToken,newPassword,confirmNewPassword})
	}

    return (
        <>
            <Head>
                <title>重設密碼</title>
            </Head>
            <section className="section-padding bg-height">
                <div className="container container-padding">
                    <form className="reset-password-form" onSubmit={submitHandler} noValidate>
						<h2 className="reset-password-form-title">重設密碼</h2>
						{error && <Error error={error} />}
						{success && <Success success={success} />}
						{loading && <Loading />}
						<div className="input-group">
							<label htmlFor="newPassword" className="input-group-icon label-icon"><FaLock className="label-icon-cursor" /></label>
							<input type={passwordIsShow?"text":"password"} className="input" id="newPassword" name="newPassword" placeholder="請輸入新密碼" value={newPassword} onChange={changeHandler} />
							<div className="input-group-icon eye-icon">{passwordIsShow?<FaEye className="eye-icon-cursor" onClick={passwordToggleHandler} />:<FaEyeSlash className="eye-icon-cursor" onClick={passwordToggleHandler} />}</div>
						</div>
						<div className="input-group">
							<label htmlFor="confirmNewPassword" className="input-group-icon label-icon"><FaLock className="label-icon-cursor" /></label>
							<input type={confirmPasswordIsShow?"text":"password"} className="input" id="confirmNewPassword" name="confirmNewPassword" placeholder="請再次輸入新密碼" value={confirmNewPassword} onChange={changeHandler} />
							<div className="input-group-icon eye-icon">{confirmPasswordIsShow?<FaEye className="eye-icon-cursor" onClick={confirmPasswordToggleHandler} />:<FaEyeSlash className="eye-icon-cursor" onClick={confirmPasswordToggleHandler} />}</div>
						</div>
						<button type="submit" className="btn-submit">送出</button>
					</form>
                </div>
            </section>
        </>
    )
}

export const getServerSideProps=async(ctx)=>{
	const {isResetPassword,token}=parseCookies(ctx)

	if(!isResetPassword && token){
		try{
			const res=await axios.get(`${baseUrl}/auth/checkLogin`,{
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			
			if(res.data.user.role==="admin"){
				return {
					redirect: {
						destination: "/admin",
						permanent: false
					}
				}
			}
			else if(res.data.user.role==="dashboard"){
				return {
					redirect: {
						destination: "/dashboard",
						permanent: false
					}
				}
			}
			else if(res.data.user.role==="user"){
				return {
					redirect: {
						destination: "/user",
						permanent: false
					}
				}
			}
		}
		catch(err){
			return {
				redirect: {
					destination: "/login",
					permanent: false
				}
			}
		}
	}
	else if(!isResetPassword && !token){
		return {
			redirect: {
				destination: "/login",
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}

export default ResetPasswordPage