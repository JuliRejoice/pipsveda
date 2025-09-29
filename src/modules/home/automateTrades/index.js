'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './automateTrades.module.scss';
import FlashIcon from '@/icons/flashIcon';
import Button from '@/compoents/button';
import { getBots } from '@/compoents/api/dashboard';
import { useRouter } from 'next/navigation';

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
        const allStrategies = response.payload.data;
        setAlgobotData(allStrategies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAlgobotData();
  }, []);

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 18;
    const rotateX = (0.5 - y) * 18;
    card.style.transition = 'transform 60ms ease-out';
    card.style.transformStyle = 'preserve-3d';
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 300ms ease';
    card.style.transform = '';
  };

  return (
    <motion.div
      className={styles.automateTrades}
      ref={ref}
      initial={{ opacity: 0, backgroundColor: "transparent" }}
      whileInView={{ opacity: 1, backgroundColor: "#000" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="container">
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
          {algobotData.map((strategy) => (
            <motion.div
              className={styles.card}
              key={strategy._id}
              variants={cardVariants}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              style={{ willChange: 'transform' }}
            >
              <div>
                <div className={styles.textstyle}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className={styles.titleText}>
                      <h3>{strategy.title}</h3>
                      <p>{strategy.shortDescription}</p>
                    </div>
                    <FlashIcon />
                  </div>
                  <div className={styles.planplangrdmain}>
                    <div className={styles.planplangrd}>
                      {strategy.strategyPlan?.slice(0, 2).map((plan) => (
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
              </div>
              <div className={styles.buttonGrid}>
                <Button
                  text="Buy Now"
                  onClick={() => {
                    router.push(`algobot-details?id=${strategy._id}`)
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
