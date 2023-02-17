import Link from 'next/link'

const LoginLink=({navbarCloseHandler})=>{
    return (
		<>
			<Link href="/" className="btn-link" onClick={navbarCloseHandler}>首頁</Link>
			<Link href="/login" className="btn-link-login" onClick={navbarCloseHandler}>登入</Link>
		</>
    )
}

export default LoginLink