'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';
import CourseDetailsBanner from '../courseDetails/courseDetailsBanner';
import AlgobotInformation from './algobotInformation';
import RecentBots from '@/app/(admin)/algobotDetails/recentBots';

export default function AlgobotDetails() {
    const botId = useSearchParams().get('id');

    return (
        <div>
            <CourseDetailsBanner />
            <AlgobotInformation id={botId}/>
            <RecentBots id={botId}/>
        </div>
    )   
}
