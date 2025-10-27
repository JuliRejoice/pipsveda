'use client'
import React, { useEffect, useState, useCallback } from 'react'
import styles from './recentCourse.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import { usePathname, useRouter } from 'next/navigation';
import { getCourses } from '@/compoents/api/dashboard';
import 'react-loading-skeleton/dist/skeleton.css';
import RenderSkeleton from './RenderSkeleton';
import EmptyState from './EmptyState';
import Button from '@/compoents/button';

const CardImage = '/assets/images/crypto.png';
const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';
const RightIcon = '/assets/icons/right.svg';

export default function RecentCourse({ selectedCourse }) {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    const courseType = () =>{
        if(pathname.includes('pre-recorded')){
            return 'pre-recorded'
        }else if(pathname.includes('live-online')){
            return 'live-online'
        }else if(pathname.includes('in-person')){
            return 'in-person'
        }
    }

    console.log("selectedCourse", selectedCourse)
    const fetchCourses = useCallback(async () => {
        if (!selectedCourse?._id) return;
        
        try {
            setIsLoading(true);
            setError(null);
            const response = await getCourses({courseType: selectedCourse?.courseType,categoryId: selectedCourse?.courseCategory
            });
            console.log(response,'dfdfl---------------')
            // Filter out the currently selected course
            const filteredCourses = response?.payload?.data?.filter(course => 
                course._id !== selectedCourse._id
            ) || [];
            setCourses(filteredCourses);
            setHasFetched(true);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCourse]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return (
        <div className={styles.recentCourseAlignment}>
            <div className={styles.title}>
                <h2>Similar Courses</h2>
            </div>
            
            {error ? (
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button 
                        className={styles.retryButton}
                        onClick={fetchCourses}
                    >
                        Try Again
                    </button>
                </div>
            ) : isLoading ? (
                <div className={styles.grid}>
                    <RenderSkeleton count={4} />
                </div>
            ) : hasFetched && courses.length === 0 ? (
                <EmptyState />
            ) : (
                <div className={styles.grid}>
                    {courses.map((course) => (
                        <div className={styles.griditems} key={course?._id}>
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
                                <p>{course?.description || 'No description available.'}</p>
                                <div className={styles.twoContentAlignment}>
                                    <h4>${course?.price || 299}</h4>
                                    <div className={styles.iconText}>
                                        <img src={BathIcon} alt='Instructor' />
                                        <span>{course?.instructor?.name || 'John Doe'}</span>
                                    </div>
                                </div>
                                {course.isPayment ?
                                <Button 
                                    text="Enrolled" 
                                    icon={RightIcon} 
                                    onClick={() => router.push(`/my-courses/course/${course?._id}`)} 
                                />
                                :
                                <OutlineButton 
                                    text="Enroll Now" 
                                    icon={RightBlackIcon} 
                                    onClick={() => router.push(`/course/${course?._id}`)} 
                                />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
