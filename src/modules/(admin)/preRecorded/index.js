import React from 'react'
import styles from './preRecorded.module.scss';
import Breadcumbs from './breadcumbs';
import CourseDetails from './courseDetails';
import RecentCourse from './recentCourse';
export default function PreRecorded() {
  return (
    <div>
      <Breadcumbs/>
      <CourseDetails/>
      <RecentCourse/>
    </div>
  )
}
