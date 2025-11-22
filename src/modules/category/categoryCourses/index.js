'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { getCourseByType, getCourseCategoryById } from '@/compoents/api/dashboard';
import styles from './categoryCourses.module.scss';
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

export default function CategoryCourses({ course }) {
    const [courses, setCourses] = useState({ recorded: [], live: [], physical: [] });
    const [activeTab, setActiveTab] = useState('recorded');
    const [activeCourse, setActiveCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
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
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await getCourseCategoryById({id:course,courseType:activeTab});
                
                if (response?.payload?.data?.length > 0) {
                    const categoryData = response.payload.data[0];
                    setCategoryName(categoryData.name);
                    
                    // Transform the data to match the expected structure
                    const formattedData = {
                        recorded: categoryData.courseCategory?.recorded?.map(course => ({
                            ...course,
                            courseImage: categoryData.image // Add category image to each course
                        })) || [],
                        live: categoryData.courseCategory?.live?.map(course => ({
                            ...course,
                            courseImage: categoryData.image // Add category image to each course
                        })) || [],
                        physical: []
                    };
                    
                    setCourses(formattedData);
                    // Set active courses based on the tab, default to recorded
                    setActiveCourse(formattedData[activeTab] || []);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [course, activeTab]);

    // Update activeCourse when activeTab changes
    useEffect(() => {
        if (courses[activeTab] && courses[activeTab].length > 0) {
            setActiveCourse(courses[activeTab]);
        } else {
            setActiveCourse([]);
        }
    }, [activeTab, courses]);

    const formatPrice = (price) => {
        return price === '0' || price === '0.00' ? 'Free' : `$${parseFloat(price).toFixed(2)}`;
    };



    return (
        <div className={styles.differentCourses} ref={ref}>
            <div className='container'>
                <div className={styles.text}>
                    <h2>{categoryName || 'Explore Our Courses'}</h2>
                    <p>
                        {categoryName 
                            ? `Browse our collection of ${categoryName.toLowerCase()} courses designed to enhance your trading and investment skills.`
                            : 'Browse through our collection of courses designed to enhance your trading and investment skills across various markets and instruments.'
                        }
                    </p>
                </div>
                <div className={styles.tabDesign}>
                    <div className={styles.tabAlignment}>
                        <button
                            className={activeTab === 'recorded' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('recorded')}
                        >
                            On Demand Courses
                        </button>
                        <button
                            className={activeTab === 'live' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('live')}
                        >
                            Live Online Courses
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
                        {activeCourse.map((course, index) => (
                            <TiltCard
                                className={styles.griditems}
                                key={course?._id || index}
                                variants={itemVariants}
                                onClick={() => router.push(`/course-details?id=${course?._id}`)}
                            >
                                <div className={styles.image}>
                                    <img
                                        src={course.courseVideo || course.courseImage || CardImage}
                                        alt={course.CourseName || 'Course'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = course.courseImage || CardImage;
                                        }}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <h3>{course?.CourseName || 'Untitled Course'}</h3>
                                    <p className={styles.description}>
                                        {course?.description || 'No description available.'}
                                    </p>
                                    <div className={styles.twoContentAlignment}>
                                        <h4>{formatPrice(course?.price) || 'Free'}</h4>
                                        <div className={styles.iconText}>
                                            <img src={BathIcon} alt='Instructor' />
                                            <span>{course?.instructor?.name}</span>
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
