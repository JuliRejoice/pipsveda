import React from 'react'
import Header from '../header'
import Footer from '../footer'

export default function MainLayout({children}) {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}
