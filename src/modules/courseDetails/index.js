'use client'
import React from 'react'
import styles from './courseDetails.module.scss';
import CourseDetailsBanner from './courseDetailsBanner';
import CourseInformation from './courseInformation';
import RecentCourse from './recentCourse';
import { useSearchParams } from 'next/navigation';

export default function CourseDetails() {
    const courseId = useSearchParams().get('id');
    return (
        <div>
            <CourseDetailsBanner />
            <CourseInformation id={courseId}/>
            <RecentCourse id={courseId}/>
        </div>
    )
}
