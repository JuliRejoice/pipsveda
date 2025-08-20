import React from 'react'
import styles from './courseDetails.module.scss';
import CourseDetailsBanner from './courseDetailsBanner';
import CourseInformation from './courseInformation';
import RecentCourse from './recentCourse';
export default function CourseDetails() {
    return (
        <div>
            <CourseDetailsBanner />
            <CourseInformation />
            <RecentCourse />
        </div>
    )
}
