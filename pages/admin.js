import Head from 'next/head'
import axios from 'axios'
import {parseCookies} from 'nookies'

import baseUrl from 'utils/baseUrl'

const AdminPage=({user})=>{
    return (
		<>
			<Head>
				<title>Admin</title>
			</Head>
			<section className="section-padding bg-height">
				<div className="container container-padding">
					AdminPage<br />
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

			if(res.data.user.role==="dashboard"){
				return {
					redirect: {
						destination: "dashboard",
						permanent: false
					}
				}
			}
			else if(res.data.user.role==="user"){
				return {
					redirect: {
						destination: "user",
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

export default AdminPage