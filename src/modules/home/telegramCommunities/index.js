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
          {telegramChannels?.length > 0 && telegramChannels?.slice(0, 3).map((channel) => (
            <motion.div
              className={styles.griditems}
              key={channel._id}
              variants={cardVariants}
            >
              <div className={styles.cardHeader}>
                <div className={styles.textStyle}>
                  <h3>{channel.channelName}</h3>
                  {/* <div className={styles.textImagealignment}>
                    <div className={styles.imageAlignment}>
                      <img src={channel.imageUrl || ProfileImage} alt={channel.title} />
                    </div>
                    <span>{channel.members || '0'} members</span>
                  </div> */}
                </div>
                <ArrowVec />
              </div>

              <div className={styles.listAlignment}>
                <p>{channel.description || 'Join our community for updates and insights'}</p>
              </div>

              <div className={styles.priceSection}>
                {channel.telegramPlan.length > 0 &&
                channel?.telegramPlan?.map((plan)=>{
                  return(
                    <div className={styles.priceContainer} key={plan._id} >
                    <span className={styles.price}>${plan.initialPrice}</span>
                    <span className={styles.priceLabel}>/{plan.planType}</span>
                  </div>
                  )
                })}

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
