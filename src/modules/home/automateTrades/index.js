'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './automateTrades.module.scss';
import FlashIcon from '@/icons/flashIcon';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';
import { getAlgobot } from '@/compoents/api/algobot';

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
  const [algobotData, setAlgobotData] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchAlgobotData = async () => {
      try {
        const response = await getAlgobot();
        console.log("response", response)
        setAlgobotData(response.payload.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAlgobotData();
  }, []);

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
          {algobotData.map((algobot, i) => (
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
                  <h3>{algobot.title}</h3>
                  <p>{algobot.shortDescription}</p>
                  <h4>
                    ${algobot.strategyPlan[0]?.price}<sub>/{algobot.strategyPlan[0]?.planType}</sub>
                  </h4>
                </div>
                <div className={styles.details}>
                  <div className={styles.listAlignment}>
                    <span className={styles.listText}>{algobot.description}</span>
                  </div>
                </div>
                <div className={styles.buttonGrid}>
                  <Button text="Buy Now" />
                  {/* <div className={styles.btndesign}>
                    <OutlineButton text="Subscribe Now" />
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
