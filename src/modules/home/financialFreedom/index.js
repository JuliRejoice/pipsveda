'use client'
import Slider from "react-slick";
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import styles from './financialFreedom.module.scss';
import StarIcon from "@/icons/starIcon";
import ProfileIcon from "@/icons/profileIcon";
import ClockIcon from "@/icons/clockIcon";
import Button from "@/compoents/button";
import Arrowicon from "@/icons/arrowicon";
import classNames from "classnames";
import { getCourseByType } from "@/compoents/api/dashboard";
import { useRouter } from 'next/navigation';
import { getCookie } from "../../../../cookie";
const Card4 = '/assets/images/card4.png';
const VecImage = '/assets/images/vec.png';
const BathIcon = '/assets/icons/bath.svg';

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

// Lightweight 3D tilt wrapper for hover interaction
function CardTilt({ children }) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        const element = ref.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const maxTilt = 8; // degrees
        const rx = ((y - midY) / midY) * -maxTilt;
        const ry = ((x - midX) / midX) * maxTilt;
        setRotateX(rx);
        setRotateY(ry);
    };

    const resetTilt = () => {
        setIsHover(false);
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <div style={{ perspective: 1000 }}>
            <motion.div
                ref={ref}
                onMouseEnter={() => setIsHover(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTilt}
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: isHover ? 1.02 : 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default function FinancialFreedom() {
    const [courses, setCourses] = useState({
        recorded: [],
        live: [],
        physical: []
    });
    const [activeType, setActiveType] = useState('recorded');
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourseByType();
                if (response && response.payload && response.payload.courses) {
                    setCourses({
                        recorded: response.payload.courses.recorded?.slice(0, 3) || [],
                        live: response.payload.courses.live?.slice(0, 3) || [],
                        physical: response.payload.courses.physical?.slice(0, 3) || []
                    });
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

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

    const courseTypes = [
        { id: 'recorded', label: 'On demand courses', course: 'pre-recorded' },
        { id: 'live', label: 'Live Online Courses', course: 'live-online' },
        { id: 'physical', label: 'In-Person Courses', course: 'in-person' }
    ];

    const currentCourses = courses[activeType] || [];
    return (
        <motion.div
            className={styles.financialFreedom}
            initial={{ opacity: 0, backgroundColor: "transparent" }}
            whileInView={{ opacity: 1, backgroundColor: "#000" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
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
                <div className={styles.tabCenter}>
                    <div className={styles.tabDesign}>
                        {courseTypes.map((type) => (
                            <motion.div
                                key={type.id}
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
                                <button
                                    className={`${styles.button} ${activeType === type.id ? styles.active : ''}`}
                                    onClick={() => setActiveType(type.id)}
                                    aria-pressed={activeType === type.id}
                                >
                                    {type.label}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className={styles.mainCardgrid}>
                    {currentCourses.map((course, index) => (
                        <div key={index}>
                            <CardTilt>
                                <div className={styles.mainCard}>
                                    <div className={styles.card}>
                                        <div className={styles.grid}>
                                            <div className={styles.griditems}>
                                                <div className={styles.img}>
                                                    <img
                                                        src={course.courseVideo || Card4}
                                                        alt={course.CourseName || 'Course Image'}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = Card4;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.griditems}>
                                                <div>
                                                    <h3>{course.CourseName || 'Course Title'}</h3>
                                                    <div className={styles.allIconText}>
                                                        <div className={styles.icontext}>
                                                            <StarIcon />
                                                            <span>{course.rating || '4.8'}</span>
                                                        </div>
                                                        {/* <div className={styles.icontext}>
                                                            <ProfileIcon />
                                                            <span>{course.students || '123'}</span>
                                                        </div> */}
                                                        <div className={styles.icontext}>
                                                            <ClockIcon />
                                                            <span>{`${course?.hours} hours` || '12 hours'}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.textAlignment}>
                                                        <h4>${course.price || '0'}</h4>
                                                        <button>{course?.courseLevel?.slice(0, 1).toUpperCase()
                                                            + course?.courseLevel?.slice(1) || 'Beginner Level'}</button>
                                                        <div className={styles.iconText}>
                                                            <img src={BathIcon} alt='Instructor' />
                                                            <span>{course?.instructor?.name || 'John Doe'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.btnWidthfull}>
                                                    <Button
                                                        text="Enroll Now"
                                                        onClick={() => {
                                                            const courseType = courseTypes.find(t => t.id === activeType)?.course || 'pre-recorded';
                                                            { getCookie('userToken') ? router.push(`/course/${course._id}`) : router.push('/signin'); }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardTilt>
                        </div>
                    ))}
                </div>
                <div className={styles.viewAllButton}>
                    <Button
                        text="View All"
                        onClick={() => {
                            const courseType = courseTypes.find(t => t.id === activeType)?.id || 'recorded';
                            router.push(`/our-course?course=${courseType}`);
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
