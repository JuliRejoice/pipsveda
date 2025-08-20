import React from 'react'
import styles from './ourCourse.module.scss';
import OurCourseBanner from './ourCourseBanner';
import DifferentCourses from './differentCourses';
import Havequestions from '../home/havequestions';
export default function OurCourse() {
    return (
        <div>
            <OurCourseBanner />
            <DifferentCourses />
            <Havequestions />
        </div>
    )
}
