'use client'
import AdminHeader from '@/compoents/adminHeader'
import ComingSoon from '@/compoents/comingSoon'
import Courses from '@/modules/(admin)/courses'
import React from 'react'

function InPerson() {
  return (
    <div>
        <AdminHeader />
        <Courses />
    </div>
  )
}

export default InPerson