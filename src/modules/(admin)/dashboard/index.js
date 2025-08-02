'use client'
import React, { useState } from 'react'
import styles from './dashboard.module.scss';
import CourseBanner from './courseBanner';
import RecentCourse from './recentCourse';
import AdminHeader from '@/compoents/adminHeader';
import ComingSoon from '@/compoents/comingSoon';
export default function Dashboard() {


  return (

    <div>
      <AdminHeader />
      <ComingSoon />

    </div>
  )
}
