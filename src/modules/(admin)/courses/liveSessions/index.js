import React, { useEffect, useState } from 'react';
import styles from './liveSessions.module.scss';
import Button from '@/compoents/button';
import MenIcon from '@/icons/menIcon';
import DownloadPrimaryIcon from '@/icons/downloadPrimaryIcon';
import DateIcon from '@/icons/dateIcon';
import ClockIcon from '@/icons/clockIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import PlayIcon from '@/icons/playIcon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Pagination from '@/compoents/pagination';
import { purchasedCourses } from '@/compoents/api/algobot';
const ITEMS_PER_PAGE = 8;

export default function LiveSessions() {
    const [liveCourses, setLiveCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE,
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await purchasedCourses({ type: "LIVE", page: pagination.currentPage, limit: ITEMS_PER_PAGE });
                if (response && response.success) {
                    setLiveCourses(response.payload.LIVE);
                    setPagination((prev) => ({
                        ...prev,
                        currentPage: 1,
                        totalItems: response.payload.count,
                    }));
                } else {
                    throw new Error(response?.message || 'Failed to fetch courses');
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Failed to load courses');
                toast.error(err.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };
    // Loading skeleton for live sessions
    const renderSkeletons = (count = 2) => {
        return Array(count).fill(0).map((_, i) => (
            <div className={styles.cardgridItems} key={`skeleton-${i}`}>
                <Skeleton height={36} width={100} style={{ marginBottom: '16px' }} />
                <Skeleton height={24} width="80%" style={{ marginBottom: '8px' }} />
                <Skeleton height={20} width="60%" style={{ marginBottom: '24px' }} />
                <Skeleton height={60} style={{ marginBottom: '16px' }} />
            </div>
        ));
    };

    // Empty state component
    const renderEmptyState = () => (
        <div className={styles.emptyState}>
            <EmptyState
                title="No Live Sessions Available"
                description="You haven't enrolled in any live sessions yet."
            />
        </div>
    );

    // Error state
    if (error) {
        return (
            <div className={styles.errorState}>
                <p>{error}</p>
                <button
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.liveSessionsAlignment}>
            {/* Upcoming Sessions */}
            <div className={styles.cardgrid}>
                {loading ? (
                    renderSkeletons(2)
                ) : liveCourses?.length === 0 ? (
                    renderEmptyState()
                ) : (
                    liveCourses?.map((liveCourse, index) => (
                        <Link 
                            href={ `/my-courses/course/${liveCourse.courseId._id}`}
                            key={index}
                        >
                            <div className={styles.cardgridItems} key={index}>
                                {liveCourse?.courseId?.courseVideo && (
                                    <div className={styles.courseImageContainer}>
                                        <img
                                            src={liveCourse.courseId.courseVideo}
                                            alt={liveCourse?.courseId?.CourseName || 'Course'}
                                            className={styles.courseImage}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    </div>
                                )}
                                <div className={styles.content}>
                                    <h3>{liveCourse?.courseId?.CourseName || 'Course Name Not Available'}</h3>
                                    <h4>Category : {liveCourse?.courseId?.courseCategory?.name}</h4>
                                    <div className={styles.icontext}>
                                        <MenIcon />
                                        <span>{liveCourse?.courseId?.instructor?.name || 'Instructor Name'}</span>
                                    </div>
                                    <p className={styles.courseDescription}>
                                        {liveCourse?.courseId?.description || 'No description available'}
                                    </p>
                                </div>
                                <div className={styles.bottomContentAlignment}>
                                    <div className={styles.nextsession}>
                                        {/* <p>Course Details</p> */}
                                        <div className={styles.twoIconTextAlignment}>
                                            {/* <div className={styles.textIcon}>
                                                <DateIcon />
                                                <span>
                                                    {liveCourse?.courseId?.courseStart ?
                                                        new Date(liveCourse.courseId.courseStart).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            <div className={styles.textIcon}>
                                                <ClockGreyIcon />
                                                <span>{liveCourse?.courseId?.hours || 'N/A'} hours</span>
                                            </div> */}
                                            {/* <div className={styles.textIcon}>
                                            <span>${liveCourse?.courseId?.price || 'N/A'}</span>
                                        </div> */}
                                        </div>

                                    </div>
                                    {/* <div className={styles.mettingContent}>
                                    <DownloadPrimaryIcon />
                                    <span>Get Meeting Link</span>
                                </div> */}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            <Pagination
                currentPage={pagination.currentPage}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
            />

        </div>
    );
}
