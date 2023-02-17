import {useEffect} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'

import Loading from 'components/message/Loading'

const NotFoundPage=()=>{
	const router=useRouter()
	
	useEffect(()=>{
		router.push("/")
	},[])

    return (
		<>
			<Head>
				<title>404 Not Found</title>
			</Head>
			<Loading />
		</>
    )
}

export default NotFoundPage