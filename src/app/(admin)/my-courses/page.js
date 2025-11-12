
import Courses from '@/modules/(admin)/courses'
import React from 'react'
import { PreventProvider } from '@/context/PreventContext';
import Breadcumbs from '@/modules/(admin)/breadcumbs';

function page() {
  return (
    <>
    <PreventProvider>
      <Breadcumbs/>
      <Courses />
    </PreventProvider>
    </>
  )
}

export default page