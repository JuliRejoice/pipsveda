import React, { useEffect, useState } from "react";
import styles from "./coursecards.module.scss";
import { getAllCourseCategory, getCourses } from "@/compoents/api/dashboard";

export default function Coursecards({ onSelect , selectedTab, id}) {
    const [activeTab, setActiveTab] = useState(selectedTab || 'recorded');
    const [title, setTitle] = useState('');

    useEffect(() => {
        setActiveTab(selectedTab || 'recorded');
    }, [selectedTab]);


    const getTitle = async () => {
        if(id){
            const response = await getAllCourseCategory({id});
            if (response.success) {
                setTitle(response.payload.data[0].name);
            }
        }
        
    }
    useEffect(() => {   
       getTitle();
    }, [id]);
    const handleClick = (tab) => {
        setActiveTab(tab.value || selectedTab);
        if (onSelect) {
            onSelect(tab.value); 
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
            <h2>{title?.slice(0,1).toUpperCase() + title?.slice(1)}</h2>            
            <div className={styles.tabsmain}>
                <div className={styles.tabs}>
                    {tabs.map((tab,index) => (
                        <button
                            key={index}
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
