import React, { useCallback, useEffect, useState } from 'react'
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

// Debounce function
const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

export default function BlogBanner({ searchQuery, setSearchQuery }) {
    const [inputValue, setInputValue] = useState(searchQuery);

    // Create a debounced version of setSearchQuery
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearchQuery = useCallback(
        debounce((value) => {
            setSearchQuery(value);
        }, 500), // 500ms delay
        []
    );

    // Update the debounced search query when input changes
    useEffect(() => {
        debouncedSetSearchQuery(inputValue);
        // Cleanup function to cancel the debounce on unmount
        return () => {
            debouncedSetSearchQuery.cancel?.();
        };
    }, [inputValue, debouncedSetSearchQuery]);

    // Sync input value with parent's searchQuery prop
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className={styles.leftrightSpacing}>
            <div className={styles.blogBanner}>
                <div className='container'>
                    <div className={styles.text}>
                        <h2>
                            Discover Our Latest Blogs
                        </h2>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
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
                            <input
                                type='text'
                                placeholder='Search for blogs...'
                                value={inputValue}
                                onChange={handleInputChange}
                            />
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
        </div>
    );
}
