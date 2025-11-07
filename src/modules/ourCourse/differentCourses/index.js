'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { getCourseByType } from '@/compoents/api/dashboard';
import Link from 'next/link';
import styles from './differentCourses.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import { useRouter } from 'next/navigation';
import RenderSkeleton from '@/modules/(admin)/chapter/recentCourse/RenderSkeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '@/compoents/button';

const CardImage = '/assets/images/crypto.png';
const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right.svg';

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
            ease: "eastOut"
        }
    }
};

// 3D tilt for entire card; keep overflow visible to prevent clipping
function TiltCard({ className, children, variants, style }) {
    const ref = useRef(null);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 18, mass: 0.8 });
    const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 18, mass: 0.8 });

    const handleMouseMove = (event) => {
        const element = ref.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;
        const tiltRange = 14;
        const rY = (relativeX - 0.5) * (tiltRange * 2);
        const rX = (0.5 - relativeY) * (tiltRange * 2);
        rotateX.set(rX);
        rotateY.set(rY);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={variants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            style={{
                transformStyle: 'preserve-3d',
                transformPerspective: 900,
                rotateX: springRotateX,
                rotateY: springRotateY,
                willChange: 'transform',
                overflow: 'visible',
                ...style
            }}
        >
            {children}
        </motion.div>
    );
}

export default function DifferentCourses({ course }) {
    const [courses, setCourses] = useState({ recorded: [], live: [], physical: [] });
    const [activeTab, setActiveTab] = useState(course);
    const [activeCourse, setActiveCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const router = useRouter();


    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    useEffect(() => {
        setActiveTab(course);
    }, [course]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await getCourseByType();
                if (response?.payload?.courses) {
                    setCourses(response.payload.courses);
                    // Set initial active courses
                    setActiveCourse(response.payload.courses[activeTab || course] || []);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [course]);

    // Update activeCourse when activeTab changes
    useEffect(() => {
        if (courses[activeTab]) {
            setActiveCourse(courses[activeTab] || []);
        }

    }, [activeTab, courses]);

    const formatPrice = (price) => {
        return price === '0' || price === '0.00' ? 'Free' : `$${parseFloat(price).toFixed(2)}`;
    };



    return (
        <div className={styles.differentCourses} ref={ref}>
            <div className='container'>
                <div className={styles.text}>
                    <h2>Explore Different Types of Courses</h2>
                    <p>
                        Browse through our collection of courses designed to enhance your trading and investment skills
                        across various markets and instruments.
                    </p>
                </div>
                <div className={styles.tabDesign}>
                    <div className={styles.tabAlignment}>
                        <button
                            className={activeTab === 'recorded' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('recorded')}
                        >
                            Recorded Courses
                        </button>
                        <button
                            className={activeTab === 'live' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('live')}
                        >
                            Live Courses
                        </button>
                        <button
                            className={activeTab === 'physical' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('physical')}
                        >
                            In-Person Courses
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.courseGrid}>
                        <RenderSkeleton count={4} />
                    </div>
                ) : activeCourse?.length > 0 ? (
                    <div
                        className={styles.courseGrid}
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                        style={{ overflow: 'visible' }}
                    >
                        {activeCourse?.map((course, index) => (
                            <TiltCard
                                className={styles.griditems}
                                key={course?._id || index}
                                variants={itemVariants}
                            >
                                <div className={styles.image}>
                                    <img
                                        src={course.courseVideo || CardImage}
                                        alt={course.CourseName || 'Course'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = CardImage;
                                        }}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <h3>{course?.CourseName || 'Untitled Course'}</h3>
                                    <p className={styles.description}>
                                        {course?.description || 'No description available.'}
                                    </p>
                                    <div className={styles.twoContentAlignment}>
                                        <h4>${course?.price || '299'}</h4>
                                        <div className={styles.level}>
                                            {course?.courseLevel?.slice(0, 1).toUpperCase() + course?.courseLevel?.slice(1) || 'Beginner Level'}
                                        </div>
                                        <div className={styles.iconText}>
                                            <img src={BathIcon} alt='Instructor' />
                                            <span>{course?.instructor?.name || 'John Doe'}</span>
                                        </div>
                                    </div>
                                    <Button text="Enroll Now"
                                        icon={RightBlackIcon}
                                        onClick={() => router.push(`/course-details?id=${course?._id}`)} />
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noCourses}>
                        No courses available in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
