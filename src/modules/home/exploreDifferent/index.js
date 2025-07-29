'use client'
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, stagger, animate } from 'framer-motion';
import styles from './exploreDifferent.module.scss';
const CardImage1 = '/assets/images/card1.png';
const CardImage2 = '/assets/images/crypto.png';
const CardImage3 = '/assets/images/card3.png';
import Slider from "react-slick";
import Arrowicon from '@/icons/arrowicon';
import classNames from 'classnames';
const BookIcon = '/assets/icons/book.svg'
const RightIcon = '/assets/icons/right-black.svg'
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
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
    const { className, style, onClick } = props;
    return (
        <div
            className={classNames(styles.arrow, styles.leftIcon)}
            onClick={onClick}
        >
            <Arrowicon />
        </div>
    );
}
const cardData = [
    {
        id: 1,
        title: "Forex Trading",
        description:
            "Lorem Ipsum simply dummy text of the printing typesetting industry Lorem Ipsum is simply dummy text of the printing.",
        image: CardImage1,
        courses: "112 Courses",
        icon: BookIcon,
    },
    {
        id: 2,
        title: "Crypto Trading",
        description:
            "Learn the fundamentals of cryptocurrency and blockchain technology with our expert-designed beginner courses.",
        image: CardImage2,
        courses: "87 Courses",
        icon: BookIcon,
    },
    {
        id: 3,
        title: "SIP Compounding",
        description:
            "Understand stock market trading strategies and analytics used by professionals to maximize profit.",
        image: CardImage3,
        courses: "135 Courses",
        icon: BookIcon,
    },
    {
        id: 4,
        title: "Forex Trading",
        description:
            "Lorem Ipsum simply dummy text of the printing typesetting industry Lorem Ipsum is simply dummy text of the printing.",
        image: CardImage1,
        courses: "112 Courses",
        icon: BookIcon,
    },
    {
        id: 5,
        title: "Crypto Trading",
        description:
            "Learn the fundamentals of cryptocurrency and blockchain technology with our expert-designed beginner courses.",
        image: CardImage2,
        courses: "87 Courses",
        icon: BookIcon,
    },
    {
        id: 6,
        title: "SIP Compounding",
        description:
            "Understand stock market trading strategies and analytics used by professionals to maximize profit.",
        image: CardImage3,
        courses: "135 Courses",
        icon: BookIcon,
    },
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function ExploreDifferent() {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

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
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
    ]
    };

    return (
        <motion.div
            className={styles.exploreDifferent}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            ref={ref}
        >
            <div className='container'>
                <motion.div className={styles.title} variants={itemVariants}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Explore Different type of courses
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        AI technology services aim to provide intelligent solutions that help businesses
                        improve efficiency,
                    </motion.p>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Slider {...settings}>
                        {cardData.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4 + (index * 0.1)
                                }}
                            >
                                <div className={styles.card}>
                                    <motion.div
                                        className={styles.image}
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <img src={card.image} alt={card.title} />
                                    </motion.div>
                                    <div className={styles.details}>
                                        <h2>{card.title}</h2>
                                        <p>{card.description}</p>
                                        <div className={styles.buttonAlignment}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <img src={card.icon} alt="icon" />
                                                <span>{card.courses}</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </Slider>
                </motion.div>
            </div>
        </motion.div>
    )
}
