'use client'
import React, { useState } from 'react'
import styles from './dashboardcard.module.scss'
import UserIcon from '@/icons/userIcon'
import { getDashboardData } from '@/compoents/api/dashboard';
import CourseIcon from '@/icons/courseIcon';
import Algobot from '@/icons/algobot';

function DashboardCard() {
    const [data, setData] = useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDashboardData();
                setData(response.payload);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            <div className={styles.dashboardCardgrd}>
                <div className={styles.dashboardcard}>
                    <div className={styles.dashboardcardtitle}>
                        <h1>Courses</h1>
                        <span><CourseIcon/>{data.courseCount || 0}</span>
                    </div>
                    <div className={styles.cardDetails}>
                        
                        <p>${data.courseTotalPrice || 0}</p>
                    </div>
                </div>
                <div className={styles.dashboardcard}>
                    <div className={styles.dashboardcardtitle}>
                        <h1>AlgoBots</h1>
                        <span><Algobot/>{data.botCount || 0}</span>
                    </div>
                    <div className={styles.cardDetails}>
                       
                        <p>${data.botTotalPrice || 0}</p>
                    </div>
                </div>
                <div className={styles.dashboardcard}>
                    <div className={styles.dashboardcardtitle}>
                        <h1>Telegram Channels</h1>
                        <span><UserIcon/>{data.telegramCount || 0}</span>
                    </div>
                    <div className={styles.cardDetails}>
                       
                        <p>${data.telegramTotalPrice || 0}</p>
                    </div>
                </div>
                {/* <div className={styles.dashboardcard}>
                    <div className={styles.dashboardcardtitle}>
                        <h1>Total Revenue</h1>
                        <span>${data.overallTotalPrice || 0}</span>
                    </div>
                    <div className={styles.cardDetails}>
                        <p>{data.overallTotalPrice || 0}</p>
                    </div>
                </div> */}
                
            </div>
        </>
    )
}

export default DashboardCard
