'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './automateTrades.module.scss';
import FlashIcon from '@/icons/flashIcon';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';
import { getAlgobot } from '@/compoents/api/algobot';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../../../cookie';
import { getBots } from '@/compoents/api/dashboard';

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
  const router = useRouter();

  useEffect(() => {
    const fetchAlgobotData = async () => {
      try {
        const response = await getBots();
        console.log(response)
        // Flatten the strategies array from all categories
        const allStrategies = response.payload.data;
        setAlgobotData(allStrategies); // Get first 3 strategies
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
          {algobotData.map((strategy, i) => (
            <motion.div
              className={styles.mainCard}
              key={strategy._id}
              variants={cardVariants}
            >
              <div className={styles.card}>
                <div className={styles.textstyle}>
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div className={styles.titleText}>
                      <h3>{strategy.title}</h3>
                      <p>{strategy.shortDescription}</p>
                    </div>
                    <FlashIcon />
                  </div>
                  <div className={styles.planplangrdmain}>
                    <div className={styles.planplangrd}>
                      {strategy.strategyPlan?.slice(0, 2).map((plan, idx) => (
                        <div className={styles.planitem} key={plan._id}>
                          <h4>
                            ${plan.price}<sub>/{plan.planType}</sub>
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.details}>
                  <div className={styles.listAlignment}>
                    <span className={styles.listText}>
                      {strategy.description.replace(/<[^>]*>?/gm, '')}
                    </span>
                  </div>
                </div>
                <div className={styles.buttonGrid}>
                  <Button 
                    text="Buy Now" 
                    onClick={() => { 
                     router.push(`algobot-details?id=${strategy._id}`)
                    }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
