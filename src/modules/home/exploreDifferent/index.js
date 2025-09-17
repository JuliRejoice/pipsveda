'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, stagger, animate } from 'framer-motion';
import styles from './exploreDifferent.module.scss';
const CardImage1 = '/assets/images/card1.png';
const CardImage2 = '/assets/images/crypto.png';
const CardImage3 = '/assets/images/card3.png';
import Slider from "react-slick";
import Arrowicon from '@/icons/arrowicon';
import classNames from 'classnames';
import { getCourseByType, getCourses } from '@/compoents/api/dashboard';
import Link from 'next/link';
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
    const [courses, setCourses] = useState([]);
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourseByType();
                console.log(response);
                setCourses(response.payload.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const cardData = [
        {
            id: 1,
            title: "Recorded Courses",
            description:
                "Learn at your own pace with our extensive library of pre-recorded courses. Access high-quality content anytime, anywhere, and Pips Veda trading at your convenience.",
            image: CardImage1,
            courses: `${courses?.recorded?.length} Recorded Courses`,
            icon: BookIcon,
            link: "/our-course?course=recorded"
        },
        {
            id: 2,
            title: "Live Webinars",
            description:
                "Join interactive live sessions with market experts. Ask questions, participate in discussions, and get your trading queries resolved in real-time.",
            image: CardImage3,
            courses: `${courses?.live?.length} Live Sessions`,
            icon: BookIcon,
            link: "/our-course?course=live"
        },
        {
            id: 3,
            title: "In-Person Training",
            description:
                "Experience hands-on learning with our expert instructors in a classroom setting. Get personalized guidance and real-time feedback to accelerate your trading journey.",
            image: CardImage2,
            courses: `${courses?.physical?.length} In-Person Programs`,
            icon: BookIcon,
            link: "/our-course?course=physical"
        },

    ];


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
                    <div className={styles.cardDiv}>
                        {cardData.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4 + (index * 0.1)
                                }}
                                whileHover={{
                                    rotateY: 8,
                                    rotateX: 3,
                                    scale: 1.03,
                                    y: -8,
                                    z: 100,
                                    transition: {
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 25,
                                        mass: 0.8
                                    }
                                }}

                                style={{
                                    perspective: 1200,
                                    transformStyle: "preserve-3d"
                                }}
                            >
                                <Link href={card.link}>
                                    <motion.div
                                        className={styles.card}
                                        whileHover={{
                                            transition: {
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 25
                                            }
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 600,
                                            damping: 40
                                        }}
                                    >
                                        <motion.div
                                            className={styles.image}
                                            whileHover={{
                                                scale: 1.08,
                                                rotateY: -5,
                                                rotateX: 2,
                                                y: -3,
                                                z: 20,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 30,
                                                    mass: 0.6
                                                }
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 700,
                                                damping: 50,
                                                mass: 0.2
                                            }}
                                        >
                                            <motion.img
                                                src={card.image}
                                                alt={card.title}
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotateZ: 1,
                                                    filter: "brightness(1.1) contrast(1.05)",
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 25
                                                    }
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 800,
                                                    damping: 60
                                                }}
                                            />
                                        </motion.div>
                                        <motion.div
                                            className={styles.details}
                                            whileHover={{
                                                y: -8,
                                                z: 10,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 25
                                                }
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 700,
                                                damping: 50
                                            }}
                                        >
                                            <motion.h2
                                                whileHover={{
                                                    scale: 1.02,
                                                    y: -2,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 20
                                                    }
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 800,
                                                    damping: 60
                                                }}
                                            >
                                                {card.title}
                                            </motion.h2>
                                            <motion.p
                                                whileHover={{
                                                    y: -1,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 25
                                                    }
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 800,
                                                    damping: 60
                                                }}
                                            >
                                                {card.description}
                                            </motion.p>
                                            <div className={styles.buttonAlignment}>
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.1,
                                                        y: -3,
                                                        rotateX: 5,
                                                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                                        transition: {
                                                            type: "spring",
                                                            stiffness: 400,
                                                            damping: 20
                                                        }
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 700,
                                                        damping: 50
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <motion.img
                                                        src={card.icon}
                                                        alt="icon"
                                                        whileHover={{
                                                            rotate: 5,
                                                            scale: 1.1,
                                                            transition: {
                                                                type: "spring",
                                                                stiffness: 500,
                                                                damping: 15
                                                            }
                                                        }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 900,
                                                            damping: 70
                                                        }}
                                                    />
                                                    <span>{card.courses}</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
