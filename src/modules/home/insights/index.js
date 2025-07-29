'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './insights.module.scss';
import UserIcon from '@/icons/userIcon';
import CalanderIcon from '@/icons/calanderIcon';
import Button from '@/compoents/button';

const BottomVec = '/assets/images/bottomvec.png';
const BlogImage = '/assets/images/blog-img.png';
const RightIcon = '/assets/icons/right-white.svg';

// Animation Variants
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function Insights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className={styles.insights}>
      <div className={styles.bottomVec}>
        <img src={BottomVec} alt='BottomVec' />
      </div>
      <div className='container' ref={ref}>
        {/* Section Title */}
        <motion.div
          className={styles.title}
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2>Financial Insights & Articles</h2>
          <p>
            Explore our curated writings on markets, strategies, and more
          </p>
        </motion.div>

        {/* Blog Cards */}
        <div className={styles.grid}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              className={styles.griditems}
              key={i}
              variants={cardVariants}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className={styles.image}>
                <img src={BlogImage} alt='BlogImage' />
              </div>
              <div className={styles.details}>
                <div className={styles.allIconText}>
                  <div className={styles.iconText}>
                    <UserIcon />
                    <span>Vikash Kumar</span>
                  </div>
                  <div className={styles.iconText}>
                    <CalanderIcon />
                    <span>Dec 15, 2025</span>
                  </div>
                </div>
                <h3>
                  5 Essential Risk Management Strategies for Day Trading
                </h3>
                <p>
                  Learn how protect your capital while maximizing
                  profits in volatile markets.
                </p>
                <Button text="Read More" icon={RightIcon} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
