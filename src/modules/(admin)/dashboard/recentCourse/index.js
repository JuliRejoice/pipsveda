'use client'
import React, { useEffect, useState } from 'react'
import styles from './recentCourse.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getCourses } from '@/compoents/api/dashboard';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardImage = '/assets/images/crypto.png';
const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';

export default function RecentCourse({searchQuery}) {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchCourses = async () => {
        try {
            console.log(searchQuery);
            setIsLoading(true);
            const data = await getCourses({searchQuery});
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
    }, [searchQuery]);

    // Skeleton loader
    const renderSkeletons = () => {
        return Array(4).fill(0).map((_, index) => (
            <div className={styles.griditems} key={`skeleton-${index}`}>
                <Skeleton height={220} className={styles.skeletonImage} />
                <div className={styles.details}>
                    <Skeleton height={24} width="80%" />
                    <Skeleton count={2} />
                    <div className={styles.twoContentAlignment}>
                        <Skeleton width={60} height={24} />
                        <Skeleton width={100} height={24} />
                    </div>
                    <Skeleton height={40} />
                </div>
            </div>
        ));
    };

    // Empty state
    const renderEmptyState = () => (
        <div className={styles.emptyState}>
        <img
          src="/assets/images/no-courses.svg"
          alt="No courses"
          className={styles.emptyImage}
        />
        <h3>No Courses Available</h3>
        <p>
          There are no courses to display at the moment.  
          Please check back later.
        </p>
       
      </div>
      
    );

    return (
        <div className={styles.recentCourse}>
            <div className={styles.title}>
                <h2>Recent Course</h2>
            </div>
            
            {error ? (
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            ) : isLoading ? (
                <div className={styles.grid}>
                    {renderSkeletons()}
                </div>
            ) : courses.length === 0 ? (
                renderEmptyState()
            ) : (
                <>
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
                    <div className={styles.paginationAlignment}>
                        <Pagination />
                    </div>
                </>
            )}
        </div>
    );
}
