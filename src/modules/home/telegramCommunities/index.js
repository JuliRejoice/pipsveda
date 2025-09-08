'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import styles from './telegramCommunities.module.scss';
import ArrowVec from '@/icons/arrowVec';
import Button from '@/compoents/button';
import { getTelegramChannels } from '@/compoents/api/dashboard';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../../../cookie';

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
  const [telegramChannels,setTelegramChannels] = useState([]);
  const router = useRouter()

  useEffect(()=>{
    const fetchTelegramChannels = async () => {
      try {
        const response = await getTelegramChannels();
        setTelegramChannels(response.payload.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTelegramChannels();
  }, []);



  const CARD_COUNT = 3;
  const [tilts, setTilts] = useState(Array.from({ length: CARD_COUNT }, () => ({ x: 0, y: 0 })));
  const [hovers, setHovers] = useState(Array.from({ length: CARD_COUNT }, () => false));

  const handleMouseMove = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    const maxRotate = 10; // degrees
    const rotateY = (x / (rect.width / 2)) * maxRotate; // left/right
    const rotateX = (-y / (rect.height / 2)) * maxRotate; // top/bottom

    setTilts((prev) => {
      const next = [...prev];
      next[index] = { x: rotateX, y: rotateY };
      return next;
    });
  };

  const handleMouseEnter = (index) => {
    setHovers((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleMouseLeave = (index) => {
    setHovers((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setTilts((prev) => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

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
          className={telegramChannels?.length > 2 ? styles.grid : styles.flex}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {telegramChannels?.length > 0 && telegramChannels?.slice(0, 3).map((channel, i) => (
            <motion.div
              className={styles.griditems}
              key={channel._id}
              variants={cardVariants}
              style={{
                transformPerspective: 1000,
                willChange: 'transform',
                transformStyle: 'preserve-3d'
              }}
              onMouseMove={(e) => handleMouseMove(i, e)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              animate={{
                rotateX: tilts[i]?.x || 0,
                rotateY: tilts[i]?.y || 0,
                scale: hovers[i] ? 1.02 : 1,
                boxShadow: hovers[i]
                  ? '0 12px 30px rgba(0,0,0,0.15)'
                  : '0 6px 12px rgba(0,0,0,0.06)'
              }}
              transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.6 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.textStyle}>
                  <h3>{channel.channelName}</h3>
                </div>
                <ArrowVec />
              </div>

              <div className={styles.listAlignment}>
                <p>{channel.description || 'Join our community for updates and insights'}</p>
              </div>

              <div className={styles.priceSection}>
                {channel.telegramPlan?.length > 0 &&
                  channel.telegramPlan.map((plan) => (
                    <div className={styles.priceContainer} key={plan._id}>
                      <span className={styles.price}>${plan.initialPrice}</span>
                      <span className={styles.priceLabel}>/{plan.planType}</span>
                    </div>
                  ))}
              </div>

              <div className={styles.btn}>
                <Button
                  text={'Join Now'}
                  onClick={() => router.push(`/telegramDetails?id=${channel._id}`)}
                />
              </div>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </div>
  );
}
