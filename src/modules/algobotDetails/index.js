'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import CourseDetailsBanner from '../courseDetails/courseDetailsBanner';
import AlgobotInformation from './algobotInformation';

export default function AlgobotDetails() {
    const botId = useSearchParams().get('id');
    return (
        <div>
            <CourseDetailsBanner />
            <AlgobotInformation id={botId} />
      
        </div>
    )
}
