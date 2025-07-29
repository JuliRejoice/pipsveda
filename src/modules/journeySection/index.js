'use client'
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './journeySection.module.scss';
import OutlineButton from '@/compoents/outlineButton';

const JourneyImge = '/assets/images/Journey.png';
const MessageIcon = '/assets/icons/message-primary.svg';

// Animation Variants
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className={styles.journeySection}>
      <div className="container" ref={ref}>
        <div className={styles.grid}>
          {/* Left Grid Content */}
          <div className={styles.griditems}>
            {/* Text Section */}
            <motion.div
              className={styles.text}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <h2>You're Not Alone On This Journey</h2>
              <p>
                Get support, share trades, and learn together in our
                vibrant community.
              </p>
            </motion.div>

            {/* Cards Section */}
            <div className={styles.callCardAlignment}>
              {[...Array(2)].map((_, i) => (
                <motion.div
                  className={styles.card}
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  <div>
                    <img src={MessageIcon} alt="MessageIcon" />
                  </div>
                  <div>
                    <h3>Join Telegram Group</h3>
                    <p>
                      Connect with 15,000+ active traders for daily insights and
                      live discussions
                    </p>
                  </div>
                  <OutlineButton text="Visit Forum" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Grid Image */}
          <motion.div
            className={styles.griditems}
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className={styles.image}>
              <img src={JourneyImge} alt="JourneyImge" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
