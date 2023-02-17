import Head from 'next/head'
import axios from 'axios'
import {parseCookies} from 'nookies'

import baseUrl from 'utils/baseUrl'

const UserPage=({user})=>{
    return (
		<>
			<Head>
				<title>User</title>
			</Head>
			<section className="section-padding bg-height">
				<div className="container container-padding">
					UserPage<br />
					{user.id}<br/>
					{user.username}<br/>
					{user.email}<br/>
					{user.role}
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

			return {
				props: {
					user: res.data.user
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
    else{
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }
}

export default UserPage