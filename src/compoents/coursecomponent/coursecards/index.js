import React, { useEffect, useState } from "react";
import styles from "./coursecards.module.scss";
import { getAllCourseCategory, getCourses } from "@/compoents/api/dashboard";

export default function Coursecards({ onSelect , selectedTab, id, instructorId, name}) {
    const [activeTab, setActiveTab] = useState(selectedTab || 'recorded');
    const [title, setTitle] = useState('');

    useEffect(() => {
        setActiveTab(selectedTab || 'recorded');
    }, [selectedTab]);


    const getTitle = async () => {
        if(instructorId){
            const response = await getCourses({instructorId});
            if (response.success) {
                setTitle(response.payload.data[0].instructor?.name);
            }
        }else{
            const response = await getAllCourseCategory({id});
            if (response.success) {
                setTitle(response.payload.data[0].name);
            }
        }
    }
    useEffect(() => {
       getTitle();
    }, [id, instructorId]);
    const handleClick = (tab) => {
        setActiveTab(tab.value || selectedTab);
        if (onSelect) {
            onSelect(tab.value); // ✅ send value instead of label
        }
    };


    const tabs = [  
        { label: "Pre Recorded Courses", value: "recorded" },
        { label: "Live Courses", value: "live" },
        { label: "In Person Courses", value: "physical" },
        // { label: "Trending Courses", value: "trending" },
        // { label: "Popular Courses", value: "popular" },
    ];

    return (
        <div className={styles.recentCourse}>
            <h2>{name?.slice(0,1).toUpperCase() + name?.slice(1) || title.slice(0,1).toUpperCase() + title.slice(1)}</h2>            
            <div className={styles.tabsmain}>
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => handleClick(tab)}
                            className={`${styles.tabsbutton} ${activeTab === tab.value ? styles.active : ""
                                }`}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
