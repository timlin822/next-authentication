import {useState,useContext} from 'react'
import {FaTimes,FaBars} from 'react-icons/fa'
import Link from 'next/link'
import {useRouter} from 'next/router'

import UserContext from 'context/user/UserContext'

import AdminLink from './AdminLink'
import DashboardLink from './DashboardLink'
import UserLink from './UserLink'
import LoginLink from './LoginLink'

const Navbar=()=>{
    const router=useRouter()

    const {role,logout}=useContext(UserContext)

    const [navbarIsOpen,setNavbarIsOpen]=useState(false)

	const navbarClickHandler=()=>{
		setNavbarIsOpen(!navbarIsOpen)
	}
	const navbarCloseHandler=()=>{
		setNavbarIsOpen(false)
	}

    const logoutHandler=()=>{
        logout()
		navbarCloseHandler()
		router.push("/")
	}

    return (
        <header className="navbar">
            <nav className="container navbar-menu">
                <Link href="/" className="navbar-logo" onClick={navbarCloseHandler}><img src="/logo.png" alt="logo" /></Link>
                <div className={navbarIsOpen?"main-navbar main-navbar-open":"main-navbar"}>
                    {role==="admin" && <AdminLink navbarCloseHandler={navbarCloseHandler} logoutHandler={logoutHandler} />}
                    {role==="dashboard" && <DashboardLink navbarCloseHandler={navbarCloseHandler} logoutHandler={logoutHandler} />}
                    {role==="user" && <UserLink navbarCloseHandler={navbarCloseHandler} logoutHandler={logoutHandler} />}
                    {!role && <LoginLink navbarCloseHandler={navbarCloseHandler} />}
                </div>
                {navbarIsOpen?<FaTimes className="btn-toggle" onClick={navbarClickHandler} />:<FaBars className="btn-toggle" onClick={navbarClickHandler} />}
            </nav>
        </header>
    )
}

export default Navbar