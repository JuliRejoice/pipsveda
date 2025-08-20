'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './blogListingCard.module.scss';
import Pagination from '@/compoents/pagination';
import OutlineButton from '@/compoents/outlineButton';

const BlogcardImage = '/assets/images/blog-card.png';
const ProfileIcon = '/assets/icons/profile-primary.svg';
const DateIcon = '/assets/icons/date-primary.svg';
const RightIcon = '/assets/icons/right-black.svg';

export default function BlogListingCard() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className={styles.blogListingCard}>
            <div className='container'>
                <motion.div
                    className={styles.tabAlignment}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button className={styles.activeTab}>All</button>
                    <button>Tab1</button>
                    <button>Tab2</button>
                    <button>Tab3</button>
                    <button>Tab4</button>
                    <button>Tab5</button>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {[...Array(6)].map((_, index) => (
                        <motion.div
                            key={index}
                            className={styles.griditems}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.01,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                className={styles.image}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img src={BlogcardImage} alt="BlogcardImage" />
                            </motion.div>
                            <div className={styles.details}>
                                <motion.div
                                    className={styles.allIconTextAlignment}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className={styles.iconText}>
                                        <img src={ProfileIcon} alt="ProfileIcon" />
                                        <span>Vikash Kumar</span>
                                    </div>
                                    <div className={styles.iconText}>
                                        <img src={DateIcon} alt="DateIcon" />
                                        <span>Dec 15, 2025</span>
                                    </div>
                                </motion.div>
                                <motion.h3
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    5 Essential Risk Management Strategies for Day Trading
                                </motion.h3>
                                <p>
                                    Learn how protect your capital while maximizing
                                    profits in volatile markets.
                                </p>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <OutlineButton text="Read More" icon={RightIcon} />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}