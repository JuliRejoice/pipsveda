'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ourStudents.module.scss';
import Slider from 'react-slick';
import StarIcon from '@/icons/starIcon';
import Arrowicon from '@/icons/arrowicon';
import classNames from 'classnames';

const SqureIcon = '/assets/icons/squre.svg';

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className={classNames(styles.arrow, styles.rightIcon)}
      onClick={onClick}
    >
      <Arrowicon />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className={classNames(styles.arrow, styles.leftIcon)}
      onClick={onClick}
    >
      <Arrowicon />
    </div>
  );
}

// Animation Variants
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
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function OurStudents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.ourStudents}>
      <div className="container" ref={ref}>
        {/* Title animation */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2>What Our Students Say</h2>
          <p>Real success stories from our trading community</p>
        </motion.div>

        <Slider {...settings}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className={styles.whiteBox}>
                <img src={SqureIcon} alt="SqureIcon" />
                <p>
                  "The strategies taught here transformed my trading completely. I went from losing
                  money to consistent profits in just 3 months."
                </p>
                <div className={styles.contentAlignment}>
                  <div className={styles.ratingAlignment}>
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <span>💰 +₹2.8L in 6 months</span>
                </div>
                <div className={styles.profilealignment}>
                  <div className={styles.profile}>RK</div>
                  <div>
                    <h4>Rajesh Kumar</h4>
                    <span>Forex Trading Pips Veday</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
