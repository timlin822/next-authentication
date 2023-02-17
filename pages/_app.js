import MessageProvider from 'context/message/MessageProvider'
import UserProvider from 'context/user/UserProvider'

import Layout from 'components/layout/Layout'

import 'styles/globals.css'

function MyApp({Component,pageProps}){
  return (
    <MessageProvider>
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
    </MessageProvider>
  )
}

export default MyApp