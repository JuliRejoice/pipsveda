'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './aboutPipsVeda.module.scss';

const CardImage = '/assets/images/about-pipsveda.png';
const CheckIcon = '/assets/icons/check-pri.svg';

export default function AboutPipsVeda() {
    const fadeInUp = {
        initial: { y: 60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerItems = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const imageAnimation = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className={styles.aboutPipsVeda}>
            <div className='container'>
                <motion.div
                    className={styles.grid}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className={styles.griditems}>
                        <motion.div
                            className={styles.image}
                            {...imageAnimation}
                        >
                            <img src={CardImage} alt='CardImage' />
                        </motion.div>
                    </div>
                    <motion.div
                        className={styles.griditems}
                        variants={staggerItems}
                    >
                        <motion.h2 variants={fadeInUp}>
                            About Pips Veda
                        </motion.h2>
                        <motion.p variants={fadeInUp}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. when an unknown printer took a galley of type and scrambled it to make
                            a type specimen book.
                        </motion.p>
                        {[1, 2, 3, 4].map((_, index) => (
                            <motion.div
                                key={index}
                                className={styles.iconText}
                                variants={fadeInUp}
                            >
                                <img src={CheckIcon} alt='CheckIcon' />
                                <span>Lorem Ipsum is simply dummy text of the printing</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}