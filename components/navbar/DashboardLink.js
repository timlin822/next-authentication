import Link from 'next/link'

const DashboardLink=({navbarCloseHandler,logoutHandler})=>{
    return (
		<>
			<Link href="/" className="btn-link" onClick={navbarCloseHandler}>首頁</Link>
			<Link href="/dashboard" className="btn-link" onClick={navbarCloseHandler}>Dashboard</Link>
			<Link href="/user" className="btn-link" onClick={navbarCloseHandler}>User</Link>
			<div className="btn-link-login" onClick={logoutHandler}>登出</div>
		</>
    )
}

export default DashboardLink