import AdminHeader from '@/compoents/adminHeader'
import Courses from '@/modules/(admin)/courses'
import React from 'react'
import { PreventProvider } from '@/context/PreventContext';

function page() {
  return (
    <>
    <PreventProvider>
      <AdminHeader />
      <Courses />
    </PreventProvider>
    </>
  )
}

export default page