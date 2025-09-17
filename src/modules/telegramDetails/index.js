'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';
import CourseDetailsBanner from '../courseDetails/courseDetailsBanner';
import TelegramInformation from './telegramInformation';


export default function TelegramDetails() {
    const botId = useSearchParams().get('id');

    return (
        <div>
            <CourseDetailsBanner />
            <TelegramInformation id={botId} />
           
            </div>
    )   
}
