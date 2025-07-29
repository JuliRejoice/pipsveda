'use client'
import React, { useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import styles from './telegramCommunities.module.scss';
import ArrowVec from '@/icons/arrowVec';
import Button from '@/compoents/button';

const ProfileImage = '/assets/images/profile-img.png';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function TelegramCommunities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className={styles.telegramCommunities}>
      <div className="container" ref={ref}>
        {/* Text Section Animation */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2>Join Private Telegram Communities</h2>
          <p>
            Connect with experts and peers for daily insights, trade setups,
            and support.
          </p>
        </motion.div>

        {/* Cards Animation */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              className={styles.griditems}
              key={i}
              variants={cardVariants}
            >
              <div className={styles.cardHeader}>
                <button aria-label='Free'>
                  <span>Free</span>
                </button>
                <ArrowVec />
              </div>
              <div className={styles.textStyle}>
                <h3>Intraday Calls</h3>
                <div className={styles.textImagealignment}>
                  <div className={styles.imageAlignment}>
                    <img src={ProfileImage} alt="ProfileImage" />
                    <img src={ProfileImage} alt="ProfileImage" />
                    <div className={styles.plus}>+</div>
                  </div>
                  <span>12.5k members</span>
                </div>
              </div>
              <div className={styles.listAlignment}>
                <ul>
                  <li>Daily market insights</li>
                  <li>Live trade calls</li>
                  <li>Community support</li>
                </ul>
              </div>
              <div className={styles.freeaccess}>
                <span>Free Access</span>
              </div>
              <div className={styles.btn}>
                <Button text="Join Now" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
