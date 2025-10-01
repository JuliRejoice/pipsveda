'use client'
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './howitWorks.module.scss';

const ProcessOne = '/assets/images/process1.png';
const BottomVec = '/assets/images/bottomvec.png';
const FirstJson = '/assets/json/1-Signup.json';

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HowitWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className={styles.howitWorks}>
      <div className={styles.bottomVec}>
        <img src={BottomVec} alt="BottomVec" />
      </div>

      <div className="container" ref={ref}>
        {/* Text heading */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2>How it Works</h2>
          <p>Your Learning Journey in 3 Simple Steps</p>
          <h3>PROCESS</h3>
        </motion.div>

        {/* First timeline section */}
        <motion.div
          className={styles.firstTimeline}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.textStyle} variants={itemVariants}>
            <h3>Sign Up & Choose a Course</h3>
            <p>
              Create your account and select from our comprehensive course catalog tailored to your
              skill level.
            </p>
          </motion.div>

          <motion.div className={styles.image} variants={itemVariants} style={{ perspective: 1000 }}>
            <motion.img
              src={ProcessOne}
              alt="ProcessOne"
              style={{ transformPerspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
              whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <h5>2</h5>
          </motion.div>

          <motion.div className={styles.textStyle} variants={itemVariants}>
            <h3>Join Community & Get Certified</h3>
            <p>
              Connect with fellow traders, get mentorship, and earn certificates upon course completion.
            </p>
          </motion.div>
        </motion.div>

        {/* Second timeline section */}
        <motion.div
          className={styles.sectimeLine}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.first} variants={itemVariants}>
            <div className={styles.dot}></div>
            <div className={styles.image} style={{ perspective: 1000 }}>
              <h5>1</h5>
              <motion.img
                src={ProcessOne}
                alt="ProcessOne"
                style={{ transformPerspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
                whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
          </motion.div>

          <motion.div className={styles.first} variants={itemVariants}>
            <div className={styles.dot}></div>
            <div className={styles.textStyle}>
              <h3>Attend Live or On-Demand Courses</h3>
              <p>
                Learn through interactive live sessions or flexible on-demand content at your own
                pace.
              </p>
            </div>
          </motion.div>

          <motion.div className={styles.first} variants={itemVariants}>
            <div className={styles.dot}></div>
            <div className={styles.image} style={{ perspective: 1000 }}>
              <h5>3</h5>
              <motion.img
                src={ProcessOne}
                alt="ProcessOne"
                style={{ transformPerspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
                whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
          </motion.div>
        </motion.div>
        <div className={styles.mobileviewTimeline}>
          <div className={styles.mainGrid}>
            <div className={styles.mainGridItems}>
              <h4>1</h4>
              <h3>
                Sign Up & Choose a Course
              </h3>
              <p>
                Create your account and select from our comprehensive course catalog tailored to your
                skill level.
              </p>
              <motion.img
                src={ProcessOne}
                alt='ProcessOne'
                style={{ transformPerspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
                whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
            <div className={styles.mainGridItems}>
              <h4>2</h4>
              <h3>
                Attend Live or On-Demand Courses
              </h3>
              <p>
                Create your account and select from our comprehensive course catalog tailored to your
                skill level.
              </p>
              <motion.img
                src={ProcessOne}
                alt='ProcessOne'
                style={{ transformPerspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
                whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
            <div className={styles.mainGridItems}>
              <h4>3</h4>
              <h3>
                Join Community & Get Certified
              </h3>
              <p>
                Create your account and select from our comprehensive course catalog tailored to your
                skill level.
              </p>
              <motion.img
                src={ProcessOne}
                alt='ProcessOne'
                style={{ transformPerspective: 800, transformStyle: 'preserve-3d', willChange: 'transform' }}
                whileHover={{ rotateX: -6, rotateY: 8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
