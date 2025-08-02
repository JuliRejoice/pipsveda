"use client";
import CourseBanner from "@/modules/(admin)/dashboard/courseBanner";
import RecentCourse from "@/modules/(admin)/dashboard/recentCourse";
import PreRecorded from "@/modules/(admin)/preRecorded";
import React, { Suspense, useState } from "react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourse, setAllCourse] = useState([]);
  return (
    <Suspense fallback={<div>Loading...</div>}>

      <CourseBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allCourse={allCourse}
        setAllCourse={setAllCourse}
      />
      <RecentCourse
        searchQuery={searchQuery}
        allCourse={allCourse}
        setAllCourses={setAllCourse}
      />
    </Suspense>
  );
}
