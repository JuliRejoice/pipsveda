'use client'
import AdminHeader from '@/compoents/adminHeader'
import Coursecards from '@/compoents/coursecomponent/coursecards';
import React, { useState } from 'react'
import RecentCourse from '@/modules/(admin)/preRecorded/recentCourse';

function Categories({params}) {
    const [selectedTab, setSelectedTab] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [allCourse, setAllCourse] = useState([]);
    const [courseType, setCourseType] = useState("preRecorded");
    const [courseLoading, setCourseLoading] = useState(true);
    const id = params.id;
    return (
    <div>
      <AdminHeader/>
      <div style={{backgroundColor: '#f5f5f5',
    border: '1px solid var(--border-color5)',
    borderRadius: '12px',
    padding: '30px'}}>
        <Coursecards onSelect={(tabName) => setSelectedTab(tabName)} selectedTab={selectedTab} id={id}
          />
      
            <RecentCourse 
                searchQuery={searchQuery}
                allCourse={allCourse}
                setAllCourses={setAllCourse}
                courseType={courseType}
                setCourseType={setCourseType}
                courseLoading={courseLoading}
                setCourseLoading={setCourseLoading}
                selectedTab={selectedTab}
                id={id}
            />
            </div>
    </div>
  )
}

export default Categories