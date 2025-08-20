'use client'
import React from 'react'
import styles from './blogBanner.module.scss';
import SearchIcon from '@/icons/searchIcon';
import { motion, useAnimation, useInView, AnimatePresence, useTransform } from 'framer-motion';
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
export default function BlogBanner() {
    return (
        <div className={styles.blogBanner}>
            <div className='container'>
                <div className={styles.text}>
                    <h2>
                        Discover Our Latest Blogs
                    </h2>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </p>
                </div>
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
            </div>
        </div>
    )
}
