import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses, getTrendingOrPopularCourses, getCourseCategoryById } from '@/compoents/api/dashboard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './recentCourse.module.scss';
import Pagination from '@/compoents/pagination';
import OutlineButton from '@/compoents/outlineButton';
import Button from '@/compoents/button';


const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';
const RightIcon = '/assets/icons/right.svg';
const CardImage = '/assets/images/crypto.png';

const ITEMS_PER_PAGE = 8;

export default function RecentCourse({ selectedTab, courseType, setCourseType, searchQuery, allCourse, setAllCourses, courseLoading, setCourseLoading, id, instructorId }) {
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE
    });
    const router = useRouter();

    const fetchCourses = async (page = 1) => {
        try {
            setCourseLoading(true);

            if (selectedTab === "trending" || selectedTab === "popular") {
                setCourseType(selectedTab);

                const response = await getTrendingOrPopularCourses({
                    type: selectedTab,
                    searchQuery: searchQuery || "",
                });

                if (response.success) {
                    setAllCourses(response.payload.data || []);
                    setPagination((prev) => ({
                        ...prev,
                        currentPage: 1,
                        totalItems: response.payload.data?.length || 0,
                    }));
                } else {
                    console.error("Failed to fetch courses:", response.message);
                    setAllCourses([]);
                }
            }
            else {
                const params = {
                    page,
                    limit: ITEMS_PER_PAGE,
                    categoryId: id,
                    courseType: selectedTab || "recorded",
                    instructorId: instructorId
                };

                const data = await getCourses(params);
                if (data?.success) {
                    setAllCourses(data?.payload?.data || []);
                }

                setPagination((prev) => ({
                    ...prev,
                    currentPage: page,
                    totalItems: data?.payload?.count || 0,
                }));
            }

            setError(null);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Failed to load courses. Please try again later.");
            setAllCourses([]);
        } finally {
            setCourseLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(1);
    }, [searchQuery, selectedTab]);

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
                src="/assets/icons/no-course.svg"
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
            {/* <div className={styles.title}>
                <h2>{courseType.slice(0, 1).toUpperCase() + courseType.slice(1)} Course</h2>
            </div> */}
            <div className={styles.grid}>
                {courseLoading ? (
                    renderSkeletons()
                ) : error ? (
                    <div className={styles.errorState}>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                ) : allCourse.length > 0 ? (
                    allCourse.map((course, index) => (
                        <div className={styles.griditems} key={course._id ? `course-${JSON.stringify(course._id)}-${index}` : `course-${index}`} onClick={() => course.isPayment ? router.push(`/my-courses/course/${course._id}`) : router.push(`/course/${course._id}`)}>
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
                                    <div className={styles.levelBadge}>
                                        {course?.courseLevel?.slice(0, 1).toUpperCase() + course?.courseLevel?.slice(1) || 'Beginner Level'}
                                    </div>
                                <div className={styles.twoContentAlignment}>
                                    <h4>${course?.price || 299}</h4>
                                    <div className={styles.iconText}>
                                        <img src={BathIcon} alt='Instructor' />
                                        <span>{course?.instructor?.name || 'John Doe'}</span>
                                    </div>
                                </div>
                                {
                                    course.isPayment ? (
                                        <Button
                                            text="Enrolled"
                                            icon={RightIcon}
                                            onClick={() =>
                                                router.push(`/my-courses/course/${course._id}`)
                                            }
                                        />
                                    ) : (
                                        <Button
                                            text="Enroll Now"
                                            icon={RightIcon}
                                            onClick={() =>
                                                router.push(`/course/${course._id}`)
                                            }
                                        />
                                    )
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    renderEmptyState()
                )}
            </div>

            {!courseLoading &&
                pagination.totalItems > pagination.itemsPerPage &&
                selectedTab !== "trending" &&
                selectedTab !== "popular" && (
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
