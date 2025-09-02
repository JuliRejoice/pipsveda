import React, { useEffect, useState } from "react";
import styles from "./coursecards.module.scss";

export default function Coursecards({ onSelect , selectedTab}) {
    const [activeTab, setActiveTab] = useState(selectedTab || 'recorded');
    console.log(activeTab);
    useEffect(() => {
        setActiveTab(selectedTab || 'recorded');
    }, [selectedTab]);
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
        { label: "Trending Courses", value: "trending" },
        { label: "Popular Courses", value: "popular" },
    ];

    return (
        <div className={styles.recentCourse}>
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
