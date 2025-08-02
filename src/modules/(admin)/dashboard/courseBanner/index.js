
'use client'
import { motion, useAnimation, useInView, AnimatePresence, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import styles from './courseBanner.module.scss';
import BathIcon from '@/icons/bathIcon';
import RightLgIcon from '@/icons/rightLgIcon';
import SearchIcon from '@/icons/searchIcon';
import TopIcon from '@/icons/topIcon';
import { getCourses } from '@/compoents/api/dashboard';
import { useRouter } from 'next/navigation';

const CardImage = '/assets/images/crypto.png';
const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};
export default function CourseBanner({searchQuery, setSearchQuery}) {
    const [courses, setCourses] = useState([]);
    const router = useRouter();

    const handleSearch = (value) => {
        setSearchQuery(value); 
    }
    const getAllCourses = async () => {
        try {
            const response = await getCourses();
            if (response.success) {
                setCourses(response.payload.data.slice(0, 3));
            } else {
                console.error("Failed to fetch courses:", response.message);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }

    useEffect(() => {
        getAllCourses();
    }, []);
    console.log(courses);
    return (
        <div className={styles.courseBanner}>
            <div className={styles.grid}>
                <div className={styles.griditems}>
                    <div className={styles.text}>
                        <h2>
                        Trade crypto CFDs with FOREX.com without needing to own the cryptocurrency itself. 
                        </h2>
                        <p>
                        Trade crypto CFDs with FOREX.com without needing to own the cryptocurrency itself. With competitive spreads on Ripple, Ether and Bitcoin CFDs. Go long or short on CFDs - Get competitive spreads - Trade without the need for a digital wallet
                        </p>
                        <motion.div
                            className={styles.searchbar}
                            variants={item}
                        >
                            <motion.div
                                className={styles.inputwrapper}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <input type='text' placeholder='Search for Course...' onChange={(e) => handleSearch(e.target.value)} value={searchQuery} />
                                <motion.div
                                    className={styles.searchIcon}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <SearchIcon />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        <div className={styles.footerButtonalignment}>
                            <div className={styles.iconText}>
                                <span>Trending</span>
                                <TopIcon/>
                            </div>
                            <div className={styles.iconText}>
                                <span>Popular</span>
                                <TopIcon/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.griditems}>
                    {
                        [...Array(courses.length)].map((_, i) => {
                            return (
                                <div className={styles.card} key={i}>
                                    <div className={styles.image}>
                                        <img src={courses[i].courseVideo} alt='CardImage' />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>{courses[i].CourseName}</h3>
                                        <div className={styles.iconText}>
                                            <BathIcon />
                                            <span>{courses[i].instructor || 'John Doe'}</span>
                                        </div>
                                        <div className={styles.lastContentAlignment}>
                                            <h4>
                                                ${courses[i].price || 199}
                                            </h4>
                                            <div className={styles.iconText} onClick={()=>router.push(`/pre-recorded?id=${courses[i]._id}`)}>
                                                <p>
                                                    Enroll Now
                                                </p>
                                                <RightLgIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

