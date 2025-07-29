'use client'
import Slider from "react-slick";
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef } from 'react'
import styles from './financialFreedom.module.scss';
import StarIcon from "@/icons/starIcon";
import ProfileIcon from "@/icons/profileIcon";
import ClockIcon from "@/icons/clockIcon";
import Button from "@/compoents/button";
import Arrowicon from "@/icons/arrowicon";
import classNames from "classnames";
const Card4 = '/assets/images/card4.png';
const VecImage = '/assets/images/vec.png';
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
export default function FinancialFreedom() {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1.9,
        centerMode: true,
        slidesToScroll: 1,
        centerPadding: "1px",
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1.1,
                    dots: true
                }
            },

        ]

    };
    return (
        <div className={styles.financialFreedom}>
            <div className={styles.vecImage}>
                <img src={VecImage} alt="VecImage" />
            </div>
            <div className='container'>
                <div className={styles.text}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        Choose Your Path to Financial Freedom
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        Live Classes. Recorded Lessons. Offline Seminars.
                    </motion.p>
                </div>
                <div className={styles.flex}>
                    <motion.div
                        className={styles.flexItems}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            },
                            hidden: { opacity: 0 }
                        }}
                    >
                       
                        {['On demand courses', 'Live Online Courses', 'In-Person Courses'].map((text, index) => (
                            <motion.div
                                key={index}
                                className={styles.btnwrapper}
                                variants={{
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.5 }
                                    },
                                    hidden: {
                                        opacity: 0,
                                        y: 20
                                    }
                                }}
                            >
                                <button>
                                    {text}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div
                        className={styles.flexItems}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <Slider {...settings}>
                            {
                                [...Array(5)].map(() => {
                                    return (
                                        <div>
                                            <div className={styles.mainCard}>
                                                <div className={styles.card}>
                                                    <div className={styles.grid}>
                                                        <div className={styles.griditems}>
                                                            <div className={styles.img}>
                                                                <img src={Card4} alt="Card4" />
                                                            </div>
                                                        </div>
                                                        <div className={styles.griditems}>
                                                            <div>
                                                                <h3>
                                                                    Crypto Currency for Beginners
                                                                </h3>
                                                                <div className={styles.allIconText}>
                                                                    <div className={styles.icontext}>
                                                                        <StarIcon />
                                                                        <span>4.8</span>
                                                                    </div>
                                                                    <div className={styles.icontext}>
                                                                        <ProfileIcon />
                                                                        <span>1234</span>
                                                                    </div>
                                                                    <div className={styles.icontext}>
                                                                        <ClockIcon />
                                                                        <span>12 hours</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.textAlignment}>
                                                                    <h4>₹785</h4>
                                                                    <button>Beginner Level</button>
                                                                </div>
                                                            </div>
                                                            <div className={styles.btnWidthfull}>
                                                                <Button text="Enroll Now" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
