"use client"
import React, { useState } from 'react'
import styles from './preRecorded.module.scss';
import Breadcumbs from '../breadcumbs';
import CourseDetails from './courseDetails';
import RecentCourse from './recentCourse';

export default function Chapters({ params }) {
  const [selectedCourse , setSelectedCourse] = useState(null);
  return (
    <div>
      <Breadcumbs/>
      <CourseDetails params={params} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
      <RecentCourse selectedCourse={selectedCourse}/>
    </div>
  )
}
