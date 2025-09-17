'use client'
import React, { useState } from 'react'
import AdminHeader from '@/compoents/adminHeader';
import DashboardCard from '../dashboard/dashboardcard';
export default function Dashboard() {


  return (

    <div>
      <AdminHeader />
      <DashboardCard />
      {/* <ComingSoon /> */}
    </div>
  )
}
