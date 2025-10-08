'use client'
import React, { useEffect } from 'react'
import styles from './ourCourseBanner.module.scss';
import { usePathname } from 'next/navigation';
import { useAnimate, useInView, motion } from 'framer-motion';
import Button from '@/compoents/button';

const LiveCardImage = '/assets/images/live-online.png'
const PreCardImage = '/assets/images/pre-recorded.png'
const PhysicalCardImage = '/assets/images/in-person-card.png'
const ArrowLine = '/assets/icons/arrow-line.svg'
const VecIcon = '/assets/icons/vec4.svg'

export default function OurCourseBanner({ course }) {
    const pathname = usePathname();
    let title = '';
    let description = '';
    let btnText = '';

    if (course === 'live') {
        title = 'Live Online Classes'
        description = 'Join our expert mentors in real-time through interactive online sessions. These live classes create a collaborative environment where you can ask questions, engage in discussions, and learn from both instructors and peers. Stay up-to-date with the latest market trends, trading strategies, and industry insights — all from the comfort of your home.',
        btnText = "Live Online Classes"
    } else if (course === 'recorded') {
        title = 'Pre Recorded Courses'
        description = 'Access a library of high-quality, pre-recorded lessons that allow you to learn at your own pace, on your own time. These courses are perfect for self-starters who prefer flexibility and the ability to revisit complex topics whenever needed. Each module is carefully structured to ensure a step-by-step understanding of trading concepts, tools, and strategies.',
        btnText = "Pre Recorded Courses"
    } else if (course === 'physical') {
        title = 'In Person Courses'
        description = 'For those who thrive in a traditional classroom setting, our in-person sessions offer a hands-on, immersive learning experience. Meet your mentors face-to-face, participate in live trading simulations, and benefit from personalized guidance in a focused environment. Ideal for learners who prefer direct interaction and real-time feedback.',
        btnText = "In Person Courses"
    } else if (pathname === '/algobots') {
        title = 'AlgoBots'
        description = 'Leverage the power of automation with our intelligent AlgoBot, designed to assist you in making data-driven trading decisions. This smart tool analyzes market trends, executes strategies, and manages trades based on predefined rules — all in real time. Perfect for traders who value efficiency, consistency, and the ability to act without emotional bias, AlgoBot helps you streamline your trading while minimizing manual effort.',
        btnText = "AlgoBots"
    }

    const [scope, animate] = useAnimate();
    const isInView = useInView(scope, { once: true, margin: '-100px' });

    useEffect(() => {
        if (!isInView) return;
        animate([
            ['h2', { opacity: 0, y: 20 }, { duration: 0 }],
            ['p', { opacity: 0, y: 20 }, { duration: 0 }],
            ['img', { opacity: 0, scale: 0.95 }, { duration: 0 }],
            ['h2', { opacity: 1, y: 0 }, { duration: 0.6, ease: 'easeOut', at: 0 }],
            ['p', { opacity: 1, y: 0 }, { duration: 0.6, ease: 'easeOut', at: 0.1 }],
            ['img', { opacity: 1, scale: 1 }, { duration: 0.8, ease: 'easeOut', at: 0.2 }],
        ]);
    }, [isInView, animate]);

    // Infinite floating VecIcon
    const vecFloat = {
        animate: {
            y: [0, -10, 0],
            x: [0, 6, 0],
            rotate: [0, 4, -4, 0],
            transition: {
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror'
            }
        }
    };

    // Arrow gentle infinite movement
    const arrowMove = {
        animate: {
            x: [0, 10, 0],
            transition: {
                duration: 4,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror'
            }
        }
    };

    // Buttons infinite floating animation
    const buttonFloat = {
        animate: {
            y: [0, -8, 0],
            scale: [1, 1.05, 1],
            rotateX: [0, 5, 0],
            rotateY: [0, -5, 0],
            transition: {
                duration: 4,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror'
            }
        }
    };

    return (
        <div className={styles.leftrightSpacing}>
            <div className={styles.ourCourseBanner} ref={scope}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* LEFT SIDE TEXT */}
                        <div className={styles.griditems}>
                            <h2>{title}</h2>
                            <p>{description}</p>
                        </div>

                        {/* RIGHT SIDE IMAGE + BUTTONS */}
                        <div className={styles.griditems}>
                            <div className={styles.image}>
                                {course === 'live' && <img src={LiveCardImage} alt="Live Online Classes" />}
                                {course === 'recorded' && <img src={PreCardImage} alt="Pre Recorded Courses" />}
                                {course === 'physical' && <img src={PhysicalCardImage} alt="In Person Courses" />}
                                {pathname === '/algobots' && <img src={LiveCardImage} alt="AlgoBots" />}
                            </div>

                            {/* Arrow Line Infinite Animation */}
                            <motion.div className={styles.arrowline} {...arrowMove}>
                                <img src={ArrowLine} alt="ArrowLine" />
                            </motion.div>

                            {/* Animated Buttons (infinite float) */}
                            <motion.div className={styles.buttonAlignment} {...buttonFloat}>
                                <Button text={btnText} />
                            </motion.div>

                            <motion.div className={styles.blackButton} {...buttonFloat}>
                                <Button text="Pips Veda Trading" black />
                            </motion.div>

                            {/* Floating Vec Icon */}
                            <motion.div className={styles.vecIcon} {...vecFloat}>
                                <img src={VecIcon} alt="VecIcon" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
