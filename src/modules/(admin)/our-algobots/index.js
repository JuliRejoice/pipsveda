import Havequestions from '@/modules/home/havequestions'
import OurCourseBanner from '@/modules/ourCourse/ourCourseBanner'
import React from 'react'
import AllAlgobots from './allAlgobots'

export default function DifferentialAlgoBots() {
    return (
        <div>
            <OurCourseBanner />
            <AllAlgobots />
            <Havequestions />
        </div>
    )
}