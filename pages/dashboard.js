import Head from 'next/head'
import axios from 'axios'
import {parseCookies} from 'nookies'

import baseUrl from 'utils/baseUrl'

const DashboardPage=({user})=>{
    return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<section className="section-padding bg-height">
				<div className="container container-padding">
					DashboardPage<br />
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

			if(res.data.user.role==="user"){
				return {
					redirect: {
						destination: "/user",
						permanent: false
					}
				}
			}

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

export default DashboardPage