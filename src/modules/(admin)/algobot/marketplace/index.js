"use client";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import React, { useState, useEffect, useCallback } from 'react'
import styles from './marketplace.module.scss';
import SearchIcon from '@/icons/searchIcon';

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Marketplace({searchQuery,setSearchQuery}) {

  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Memoize the debounced search to prevent recreation on each render
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Update local state and trigger debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value.trimStart();
    setInputValue(value);
    debouncedSearch(value);
  };

  // Sync local state with prop
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className={styles.marketplace}>
      <div className={styles.centerAlignmentBox}>
        <div className={styles.text}>
            <h2>
                AlgoBot Marketplace
            </h2>
            <p>
                Automate your trading with professionally developed algorithmic 
                trading bots
            </p>
        </div>
           <motion.div className={styles.searchbar} variants={item}>
              <motion.div
                className={styles.inputwrapper}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="text"
                  placeholder="Search for Algobot..."
                  value={inputValue}
                  onChange={handleSearchChange}
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
  )
}
