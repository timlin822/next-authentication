import {useState,useEffect,useContext} from 'react'
import {FaUserAlt,FaLock,FaEye,FaEyeSlash} from 'react-icons/fa'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import axios from 'axios'
import {parseCookies} from 'nookies'

import MessageContext from 'context/message/MessageContext'
import UserContext from 'context/user/UserContext'

import Error from 'components/message/Error'
import Loading from 'components/message/Loading'

import baseUrl from 'utils/baseUrl'

const LoginPage=()=>{
	const router=useRouter()

    const {error,success,loading,clearMessage,setError}=useContext(MessageContext)
	const {role,login}=useContext(UserContext)

	const [userData,setUserData]=useState({
		email: "",
		password: "",
		rememberMe: false
	})
	const {email,password,rememberMe}=userData
	const [passwordIsShow,setPasswordIsShow]=useState(false)
	
	useEffect(()=>{
		clearMessage()

		if(JSON.parse(localStorage.getItem("rememberMe"))){
            setUserData({
                email: localStorage.getItem("email"),
                password: "",
                rememberMe: JSON.parse(localStorage.getItem("rememberMe"))
            })
        }
	},[])
	useEffect(()=>{
        if(rememberMe){
            localStorage.setItem("rememberMe",rememberMe)
            localStorage.setItem("email",email)
        }
        else{
            localStorage.removeItem("rememberMe")
            localStorage.removeItem("email")
        }
    },[email,rememberMe])
    useEffect(()=>{
		if(success==="登入成功"){
			if(role==="admin"){
				router.push("/admin")
			}
			else if(role==="dashboard"){
				router.push("/dashboard")
			}
			else if(role==="user"){
				router.push("/user")
			}
		}
	},[success])

	const changeHandler=(e)=>{
		clearMessage()
		
		const value=e.target.type==="checkbox"?e.target.checked:e.target.value
		setUserData({
			...userData,
			[e.target.name]: value
		})
	}
	
	const passwordToggleHandler=()=>{
		setPasswordIsShow(!passwordIsShow)
	}

	const submitHandler=(e)=>{
		e.preventDefault()
		const emailPattern=/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        const passwordPattern=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
		
		// 檢查全部欄位是否填寫
        if(!email || !password){
			return setError("請填寫完整")
        }
        // 檢查Email格式是否符合
        if(!email.match(emailPattern)){
			return setError("Email格式錯誤")
		}
		// 檢查密碼長度是否大於8個字元
        if(password.length<8){
			return setError("請填寫至少8個字元")
        }
		// 檢查密碼格式是否符合
		if(!password.match(passwordPattern)){
			return setError("請填寫至少包括1個大寫字元、1個小寫字元、1個數字、1個特殊字元")
		}

		login({email,password})
	}

    return (
        <>
            <Head>
                <title>登入</title>
            </Head>
            <section className="section-padding bg-height">
                <div className="container container-padding">
                    <form className="login-form" onSubmit={submitHandler} noValidate>
                        <h2 className="login-form-title">登入</h2>
                        {error && <Error error={error} />}
                        {loading && <Loading />}
                        <div className="input-group">
                            <label htmlFor="email" className="input-group-icon label-icon"><FaUserAlt className="label-icon-cursor" /></label>
                            <input type="email" className="input" id="email" name="email" placeholder="請輸入Email" autoComplete="off" value={email} onChange={changeHandler} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password" className="input-group-icon label-icon"><FaLock className="label-icon-cursor" /></label>
                            <input type={passwordIsShow?"text":"password"} className="input" id="password" name="password" placeholder="請輸入密碼" value={password} onChange={changeHandler} />
                            <div className="input-group-icon eye-icon">{passwordIsShow?<FaEye className="eye-icon-cursor" onClick={passwordToggleHandler} />:<FaEyeSlash className="eye-icon-cursor" onClick={passwordToggleHandler} />}</div>
                        </div>
                        <div className="input-group space-between">
                            <div><input type="checkbox" className="checkbox-input" id="rememberMe" name="rememberMe" checked={rememberMe} onChange={changeHandler} /><label htmlFor="rememberMe" className="rememberMe">記住我</label></div>
                            <Link href="/forgetPassword" className="forget-password-link">忘記密碼</Link>
                        </div>
                        <button type="submit" className="btn-login">登入</button>
                        <p className="text">不是會員? &nbsp;<Link href="/register" className="router-link">註冊</Link></p>
                    </form>
                </div>
            </section>
        </>
    )
}

export const getServerSideProps=async(ctx)=>{
	const {token}=parseCookies(ctx)

    if(token){
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
			console.log(err)
		}
	}

	return {
		props: {}
	}
}

export default LoginPage