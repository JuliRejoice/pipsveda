'use client'
import React from 'react'
import styles from './ourCourse.module.scss';
import OurCourseBanner from './ourCourseBanner';
import DifferentCourses from './differentCourses';
import Havequestions from '../home/havequestions';
import { useSearchParams } from 'next/navigation';
export default function OurCourse() {
    const searchParams = useSearchParams();
    const course = searchParams.get('course');
    
    return (
        <div>
            <OurCourseBanner course={course}/>
            <DifferentCourses course={course}/>
            <Havequestions />
        </div>
    )
}
