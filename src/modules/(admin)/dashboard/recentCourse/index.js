'use client'
import React, { useEffect, useState } from 'react'
import styles from './recentCourse.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getCourses } from '@/compoents/api/dashboard';
const CardImage = '/assets/images/crypto.png';
const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';


export default function RecentCourse() {
const [courses, setCourses] = useState([]); // Assuming you will fetch courses data later
useEffect(()=>{
    getCourses().then((data) => {
        setCourses(data);
    }).catch((error) => {
        console.error('Error fetching courses:', error);
        // Handle error state if needed
    });
}, []);

console.log('courses', courses);
    return (
        <div className={styles.recentCourse}>
            <div className={styles.title}>
                <h2>
                    Recent Course
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(8)].map(() => {
                        return (
                            <div className={styles.griditems}>
                                <div className={styles.image}>
                                    <img src={CardImage} alt='CardImage' />
                                </div>
                                <div className={styles.details}>
                                    <h3>Crypto Currency for Beginners</h3>
                                    <p>
                                        Lorem Ipsum has been the industry's standard dummy text
                                        ever...
                                    </p>
                                    <div className={styles.twoContentAlignment}>
                                        <h4>
                                            $789
                                        </h4>
                                        <div className={styles.iconText}>
                                            <img src={BathIcon} alt='BathIcon' />
                                            <span>John  Doe</span>
                                        </div>
                                    </div>
                                    <OutlineButton text="Enroll Now" icon={RightBlackIcon} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.paginationAlignment}>
                <Pagination/>
            </div>
        </div>
    )
}
