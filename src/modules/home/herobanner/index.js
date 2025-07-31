'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence, useTransform } from 'framer-motion';
import styles from './herobanner.module.scss';
import SearchIcon from '@/icons/searchIcon';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';
import CircleAnimation from '@/icons/circleAnimation';

const RightIcon = '/assets/icons/right.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';
const LineImage = '/assets/icons/line.svg';
const VideoPoster = '/assets/images/video-poster.jpg';
const IconLogo = '/assets/logo/icon-logo.svg';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};
const AnimatedText = ({ text, className = '' }) => {
  const words = text.split(' ');
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: wordIndex * 0.05,
              ease: [0.2, 0.65, 0.3, 0.9]
            }}
          >
            {word + ' '}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default function Herobanner() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('show');
    }
  }, [controls, isInView]);

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={container}
        ref={ref}
      >
        <motion.div
          className={styles.herobannerDesign}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className='container'>
            <div className={styles.text}>
              <motion.div
                className={styles.pipsvedaRound}
                variants={item}
              >
                <span>Master Forex Trading Pips Veda</span>
                <motion.img
                  src={LineImage}
                  alt='LineImage'
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                />
              </motion.div>

              <h1>
                Master the Markets Build  <br /> a Financial Future That Lasts
              </h1>

              <motion.p
                variants={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                AI technology services aim to provide intelligent solutions that help businesses
                improve efficiency,
              </motion.p>

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

              <motion.div
                className={styles.buttonAlignment}
                variants={item}
              >
                <Button text="Explore Courses" icon={RightIcon} />
                <OutlineButton text="Explore Courses" icon={RightBlackIcon} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.herobannerVideo}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className='container'>
            <motion.div
              className={styles.videoPoster}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.img
                src={VideoPoster}
                alt='VideoPoster'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
              <div
                className={styles.roundTopalignment}
              >
                <div className={styles.circleanimation}>
                  <CircleAnimation />
                  <div
                    className={styles.circleanimatiopnlogomain}

                  >
                    <div className={styles.circleanimatiopnlogo}>
                      <img src={IconLogo} alt="logo" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
