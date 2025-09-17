'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence, useTransform } from 'framer-motion';
import styles from './herobanner.module.scss';
import SearchIcon from '@/icons/searchIcon';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';
import CircleAnimation from '@/icons/circleAnimation';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../../../cookie';

const RightIcon = '/assets/icons/right.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';
const LineImage = '/assets/icons/line.svg';
const VideoPoster = '/assets/images/video-poster.jpg';
const CardImage = '/assets/images/card1.png';
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
  const router = useRouter();
  const [searchParams, setSearchParams] = useState();
  const [cardTilt, setCardTilt] = useState(
    Array.from({ length: 3 }, () => ({ rx: 0, ry: 0, scale: 1 }))
  );

  useEffect(() => {
    if (isInView) {
      controls.start('show');
    }
  }, [controls, isInView]);

  const handleMouseEnter = (index) => {
    setCardTilt((prev) => {
      const next = [...prev];
      next[index] = { rx: 0, ry: 0, scale: 1.02 };
      return next;
    });
  };

  const handleMouseMove = (event, index) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const centerX = rect.left + cardWidth / 2;
    const centerY = rect.top + cardHeight / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    const rotateY = (mouseX / (cardWidth / 2)) * 10; // left/right
    const rotateX = (-mouseY / (cardHeight / 2)) * 10; // up/down

    setCardTilt((prev) => {
      const next = [...prev];
      next[index] = { rx: rotateX, ry: rotateY, scale: 1.02 };
      return next;
    });
  };

  const handleMouseLeave = (index) => {
    setCardTilt((prev) => {
      const next = [...prev];
      next[index] = { rx: 0, ry: 0, scale: 1 };
      return next;
    });
  };

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
          <div className='container-md'>
            <div className={styles.text}>
              <h1>
                Pips Veda the Markets Build  <br /> a Financial Future That Lasts
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
              <div className={styles.searchButtonalignment}>
                <motion.div
                  className={styles.searchbar}
                  variants={item}
                >
                  <motion.div
                    className={styles.inputwrapper}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input type='text' placeholder='Search for Course...' onChange={(e) => setSearchParams(e.target.value)} />
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
                  <Button text="Explore Courses" icon={RightIcon} onClick={() => { getCookie("userToken") ? router.push(`/courses/pre-recorded?search=${searchParams}`) : router.push('/signin') }} />

                </motion.div>
              </div>
              <div className={styles.cardGrid}>
                {
                  [...Array(3)].map((_, index) => {
                    return (
                      <motion.div
                        className={styles.cardGridItems}
                        key={index}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                        initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
                        animate={{ rotateX: cardTilt[index].rx, rotateY: cardTilt[index].ry, scale: cardTilt[index].scale }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.6 }}
                      >
                        <div className={styles.image}>
                          <img src={CardImage} alt='CardImage' />
                          <button>
                            undefined Live Sessions
                          </button>
                        </div>
                        <div className={styles.details}>
                          <h2>
                            Live Webinars
                          </h2>
                          <p>
                            Join interactive live sessions with market experts. Ask questions, participate in
                            discussions, and get your trading queries resolved in real-time.
                          </p>

                        </div>
                      </motion.div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </motion.div>

        {/* <motion.div
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
        </motion.div> */}
      </motion.div>
    </AnimatePresence>
  );
}
