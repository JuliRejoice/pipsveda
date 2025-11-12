'use client'
import React, { useState } from 'react'
import Breadcumbs from '@/modules/(admin)/breadcumbs';
import Coursecards from '@/compoents/coursecomponent/coursecards';
import RecentCourse from '@/modules/(admin)/preRecorded/recentCourse';
import { useSearchParams } from 'next/navigation';
import InstructorProfile from '@/modules/(admin)/instructor/instructorProfile';


function CoursesOfferedByInstructor({ params }) {
    const [selectedTab, setSelectedTab] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [allCourse, setAllCourse] = useState([]);
    const [courseType, setCourseType] = useState("preRecorded");
    const [courseLoading, setCourseLoading] = useState(true);
    const id = params.id;

    return (
        <div>
            <Breadcumbs/>
            <div style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid var(--border-color5)',
                borderRadius: '12px',
                padding: '30px'
            }}>
                <InstructorProfile id={id}/>
                
                <Coursecards onSelect={(tabName) => setSelectedTab(tabName)} selectedTab={selectedTab} />
                

                <RecentCourse
                    searchQuery={searchQuery}
                    allCourse={allCourse}
                    setAllCourses={setAllCourse}
                    courseType={courseType}
                    setCourseType={setCourseType}
                    courseLoading={courseLoading}
                    setCourseLoading={setCourseLoading}
                    selectedTab={selectedTab}
                    instructorId={id}
                />
            </div>
        </div>
    )
}

export default CoursesOfferedByInstructor