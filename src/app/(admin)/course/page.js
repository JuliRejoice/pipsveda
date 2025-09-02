"use client"
import AdminHeader from '@/compoents/adminHeader';
import Coursecards from '@/compoents/coursecomponent/coursecards';
import Loader from '@/compoents/loader';
import InPersonCourse from '@/modules/(admin)/chapter/inPerson/inPersonCourse';
import LiveCourse from '@/modules/(admin)/liveonline/liveCourse';
import CourseBanner from '@/modules/(admin)/preRecorded/courseBanner';
import RecentCourse from "@/modules/(admin)/preRecorded/recentCourse";
import React, { Suspense, useState } from 'react'

export default function Course() {
    const [searchQuery, setSearchQuery] = useState("");
    const [allCourse, setAllCourse] = useState([]);
    const [courseType, setCourseType] = useState("preRecorded");
    const [courseLoading, setCourseLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("");
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>}>
            <AdminHeader />
            <CourseBanner
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                allCourse={allCourse}
                setAllCourse={setAllCourse}
                courseType={courseType}
                setCourseType={setCourseType}
                courseLoading={courseLoading}
                setCourseLoading={setCourseLoading}
                setSelectedTab={setSelectedTab}
            />
            {/* <---- Tabs ----> */}
            <Coursecards onSelect={(tabName) => setSelectedTab(tabName)} selectedTab={selectedTab} />
            {/* <-- Trending,popular,pre courses */}
            <RecentCourse
                searchQuery={searchQuery}
                allCourse={allCourse}
                setAllCourses={setAllCourse}
                courseType={courseType}
                setCourseType={setCourseType}
                courseLoading={courseLoading}
                setCourseLoading={setCourseLoading}
                selectedTab={selectedTab}
            />
            {/* <-- live courses */}
            {/* <LiveCourse /> */}
            {/* <-- inperson courses */}
            {/* <InPersonCourse /> */}
        </Suspense>
    )
}
