
'use client'
import { motion, useAnimation, useInView, AnimatePresence, useTransform } from 'framer-motion';
import React from 'react'
import styles from './courseBanner.module.scss';
import BathIcon from '@/icons/bathIcon';
import RightLgIcon from '@/icons/rightLgIcon';
import SearchIcon from '@/icons/searchIcon';
import TopIcon from '@/icons/topIcon';
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
export default function CourseBanner() {
    return (
        <div className={styles.courseBanner}>
            <div className={styles.grid}>
                <div className={styles.griditems}>
                    <div className={styles.text}>
                        <h2>
                            Lorem Ipsum simply dummy printing
                            and typesetting industry.
                        </h2>
                        <p>
                            Lorem Ipsum has been the industry's standard dummy text ever since
                            when an unknown printer took a galley of type.
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
                                <input type='text' placeholder='Search for Course...' />
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
                                <span>Trending Course</span>
                                <TopIcon/>
                            </div>
                            <div className={styles.iconText}>
                                <span>Crypto</span>
                                <TopIcon/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.griditems}>
                    {
                        [...Array(3)].map((_, i) => {
                            return (
                                <div className={styles.card} key={i}>
                                    <div className={styles.image}>
                                        <img src={CardImage} alt='CardImage' />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>Crypto Currency for Beginners</h3>
                                        <div className={styles.iconText}>
                                            <BathIcon />
                                            <span>John  Doe</span>
                                        </div>
                                        <div className={styles.lastContentAlignment}>
                                            <h4>
                                                $864
                                            </h4>
                                            <div className={styles.iconText}>
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

