import Meta from './Meta'
import Navbar from 'components/navbar/Navbar'
import Footer from 'components/footer/Footer'

const Layout=({children})=>{
    return (
        <>
            <Meta />
            <Navbar />
            {children}
            <Footer />
        </>
    )
}

export default Layout