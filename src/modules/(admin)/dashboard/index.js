import React from 'react'
import styles from './dashboard.module.scss';
import CourseBanner from './courseBanner';
import RecentCourse from './recentCourse';
import AdminHeader from '@/compoents/adminHeader';
export default function Dashboard() {
  return (
    <div>
      <AdminHeader />
      <CourseBanner />
      <RecentCourse />
    </div>
  )
}
