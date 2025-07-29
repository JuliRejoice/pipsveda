import Footer from '@/compoents/footer'
import Header from '@/compoents/header'
export default function layout({children}) {
  return (
    <>
      <Header/>
      {children}
      <Footer/>
    </>
  )
}
