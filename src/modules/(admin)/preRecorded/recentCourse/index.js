'use client'
import React, { useEffect, useState } from 'react'
import styles from './recentCourse.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import { useRouter } from 'next/navigation';
import { getCourses } from '@/compoents/api/dashboard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import RenderSkeleton from './RenderSkeleton';
import EmptyState from './EmptyState';

const CardImage = '/assets/images/crypto.png';
const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';

export default function RecentCourse() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const data = await getCourses();
            setCourses(data?.payload?.data || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);


    // const renderSkeletons = () => {
    //     return Array(4).fill(0).map((_, index) => (
    //         <div className={styles.griditems} key={`skeleton-${index}`}>
    //             <Skeleton height={200} className={styles.skeletonImage} />
    //             <div className={styles.details}>
    //                 <Skeleton height={24} width="80%" />
    //                 <Skeleton count={2} style={{ marginTop: '10px' }} />
    //                 <div className={styles.twoContentAlignment} style={{ marginTop: '15px' }}>
    //                     <Skeleton width={80} height={20} />
    //                     <Skeleton width={100} height={20} />
    //                 </div>
    //                 <Skeleton height={40} style={{ marginTop: '15px' }} />
    //             </div>
    //         </div>
    //     ));
    // };

    // // Empty state
    // const renderEmptyState = () => (
    //     <div className={styles.emptyState}>
    //         <div className={styles.emptyImage}>
    //             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#9CA3AF"/>
    //             </svg>
    //         </div>
    //         <h3>No Courses Available</h3>
    //         <p>There are no courses to display at the moment. Please check back later.</p>
    //     </div>
    // );

    return (
        <div className={styles.recentCourseAlignment}>
            <div className={styles.title}>
                <h2>Recent Course</h2>
            </div>
            
            {error ? (
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button 
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            ) : isLoading ? (
                <div className={styles.grid}>
                    <RenderSkeleton />
                </div>
            ) : courses.length === 0 ? (
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
                                        <span>{course?.instructor || 'John Doe'}</span>
                                    </div>
                                </div>
                                <OutlineButton 
                                    text="Enroll Now" 
                                    icon={RightBlackIcon} 
                                    onClick={() => router.push(`/pre-recorded?id=${course?._id}`)} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
