'use client'
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './automateTrades.module.scss';
import FlashIcon from '@/icons/flashIcon';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function AutomateTrades() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className={styles.automateTrades}>
      <div className="container" ref={ref}>
        {/* Text Section */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2>Automate Your Trades with Powerful Bots</h2>
          <p>Leverage tested strategies for intraday, swing, and crypto trading.</p>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              className={styles.mainCard}
              key={i}
              variants={cardVariants}
            >
              <div className={styles.card}>
                <div className={styles.headerAlignment}>
                  <button aria-label='Free'>Free</button>
                  <FlashIcon />
                </div>
                <div className={styles.textstyle}>
                  <h3>Bank Nifty Scalper</h3>
                  <p>Intraday Scalping</p>
                  <h4>
                    ₹1499<sub>/Per Month</sub>
                  </h4>
                </div>
                <div className={styles.details}>
                  <ul>
                    <li>Accuracy 89%</li>
                    <li>Risk Level Medium</li>
                    <li>Platform Used Zerodha</li>
                  </ul>
                </div>
                <div className={styles.buttonGrid}>
                  <Button text="Connect & Start" />
                  <div className={styles.btndesign}>
                    <OutlineButton text="Subscribe Now" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
