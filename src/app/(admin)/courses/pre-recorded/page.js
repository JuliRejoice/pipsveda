"use client";
import AdminHeader from "@/compoents/adminHeader";
import Loader from "@/compoents/loader";
import CourseBanner from "@/modules/(admin)/dashboard/courseBanner";
import RecentCourse from "@/modules/(admin)/dashboard/recentCourse";
import React, { Suspense, useState } from "react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourse, setAllCourse] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader/></div>}>
      <AdminHeader/>
      <CourseBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allCourse={allCourse}
        setAllCourse={setAllCourse}
        courseLoading={courseLoading}
        setCourseLoading={setCourseLoading}
      />
      <RecentCourse
        searchQuery={searchQuery}
        allCourse={allCourse}
        setAllCourses={setAllCourse}
        courseLoading={courseLoading}
        setCourseLoading={setCourseLoading}
      />
    </Suspense>
  );
}
