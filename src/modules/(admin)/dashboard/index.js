'use client'
import React, { useState } from 'react'
import styles from './dashboard.module.scss';
import CourseBanner from './courseBanner';
import RecentCourse from './recentCourse';
import AdminHeader from '@/compoents/adminHeader';
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (

    <div>
      <AdminHeader />
      <CourseBanner searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <RecentCourse searchQuery={searchQuery}/>
    </div>
  )
}
