import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses } from '@/compoents/api/dashboard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './recentCourse.module.scss';
import Pagination from '@/compoents/pagination';
import OutlineButton from '@/compoents/outlineButton';

const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';
const CardImage = '/assets/images/crypto.png';

const ITEMS_PER_PAGE = 8; // Adjust based on your layout

export default function RecentCourse({ searchQuery , allCourse , setAllCourses}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE
    });
    const router = useRouter();

    const fetchCourses = async (page = 1) => {
        try {
            setIsLoading(true);
            const data = await getCourses({
                searchQuery,
                page,
                limit: ITEMS_PER_PAGE
            });
            
            setAllCourses(data?.payload?.data || allCourse || []);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalItems: data?.payload?.count || 0
            }));
            setError(null);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
            setAllCourses([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // Reset to first page when search query changes
        fetchCourses(1);
    }, [searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
            fetchCourses(newPage);
            // Optional: Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Skeleton loader
    const renderSkeletons = () => {
        return Array(pagination.itemsPerPage).fill(0).map((_, index) => (
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
            <div className={styles.grid}>
                {isLoading ? (
                    renderSkeletons()
                ) : error ? (
                    <div className={styles.errorState}>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                ) : allCourse.length > 0 ? (
                    allCourse.map((course) => (
                        <div className={styles.griditems} key={course._id}>
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
                                    onClick={() => router.push(`/pre-recorded/${course._id}`)} 
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    renderEmptyState()
                )}
            </div>

            {!isLoading && pagination.totalItems > pagination.itemsPerPage && (
                <div className={styles.paginationAlignment}>
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
