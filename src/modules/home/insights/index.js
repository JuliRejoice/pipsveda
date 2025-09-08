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

// Keep variants free of transform properties to avoid conflicts with hover tilt
const cardVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    // Tilt range in degrees
    const rotateRange = 10;
    const rotateY = ((x - midX) / midX) * rotateRange; // left/right
    const rotateX = -((y - midY) / midY) * rotateRange; // up/down (invert for natural feel)

    card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
  };

  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--s', '1.03');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--s', '1');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

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
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform:
                  'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--s, 1))',
                transformStyle: 'preserve-3d',
                transition: 'transform 150ms ease',
                willChange: 'transform',
              }}
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
