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
const LineImage = '/assets/images/line-img.png';
const Banner1 = '/assets/images/banner1.png';
const Banner2 = '/assets/images/banner2.png';
const RowBanner = '/assets/images/row.png';
const SystemBanner = '/assets/images/system-img.png';
const CrossLineImage = '/assets/images/cross-line.png';

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

// Updated Section Animation variants
const updatedSectionContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const cardVariants = {
  hidden: {
    y: 60,
    opacity: 0,
    scale: 0.8
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

const imageVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    rotate: -5
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      duration: 0.6,
    },
  },
};

const textVariants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    },
  },
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
                Pips Veda the Markets Build a Financial Future That Lasts
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
            </div>
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
                <Button text="Explore Courses" icon={RightIcon} onClick={() => { getCookie("userToken") ? router.push(`/course?search=${searchParams}`) : router.push('/signin') }} />

              </motion.div>
            </div>
          </div>
          <motion.div
            className={styles.updatedSection}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={updatedSectionContainer}
          >
            <motion.div variants={cardVariants}>
              <motion.div
                className={styles.singleCard}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className={styles.header} variants={textVariants}>
                  <p>
                    Real-world Trading Simulations
                  </p>
                </motion.div>
                <motion.div className={styles.image} variants={imageVariants}>
                  <motion.img
                    src={LineImage}
                    alt='LineImage'
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div variants={cardVariants}>
              <motion.div
                className={styles.imageSection}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={Banner1}
                  alt='Banner1'
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
              <motion.div
                className={styles.detailsBox}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: 'rgba(20, 20, 20, 0.9)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.p variants={textVariants}>
                  Telegram & Discord Support
                  Channels
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div variants={cardVariants}>
              <motion.div
                className={styles.lifetimeBox}
                whileHover={{
                  scale: 1.03,
                  rotateX: 2,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.p variants={textVariants}>Lifetime Access to Resources</motion.p>
                <motion.div className={styles.image} variants={imageVariants}>
                  <motion.img
                    src={RowBanner}
                    alt='RowBanner'
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className={styles.systemImage}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={SystemBanner}
                  alt='SystemBanner'
                  variants={imageVariants}
                  whileHover={{ scale: 1.05, rotateY: 3 }}
                />
              </motion.div>
            </motion.div>
            <motion.div className={styles.hidenSection} variants={cardVariants}>
              <motion.div
                className={styles.imageSection}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={Banner2}
                  alt='Banner2'
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
              <motion.div
                className={styles.detailsBox}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: 'rgba(20, 20, 20, 0.9)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.p variants={textVariants}>
                  Mentor Feedback & Portfolio
                  Reviews
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div className={styles.hidenSection} variants={cardVariants}>
              <motion.div
                className={styles.singleCard}
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className={styles.header} variants={textVariants}>
                  <p>
                    Certificate of Completion
                  </p>
                </motion.div>
                <motion.div className={styles.image} variants={imageVariants}>
                  <motion.img
                    src={CrossLineImage}
                    alt='CrossLineImage'
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
}
