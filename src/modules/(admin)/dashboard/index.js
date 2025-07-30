import React from 'react'
import styles from './dashboard.module.scss';
import TrendingCourse from './trendingCourse';
import OurSyllabus from './ourSyllabus';
import RecentCourse from './recentCourse';
export default function Dashboard() {
  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.grid}>
        <div className={styles.griditems}>
            <TrendingCourse/>
        </div>
        <div className={styles.griditems}>
            <OurSyllabus/>
        </div>
      </div>
      <RecentCourse/>
    </div>
  )
}
