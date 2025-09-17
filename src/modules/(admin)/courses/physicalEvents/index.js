import React, { useEffect, useState } from 'react';
import styles from './physicalEvents.module.scss';
import DownloadPrimaryIcon from '@/icons/downloadPrimaryIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import DateIcon from '@/icons/dateIcon';
import MenIcon from '@/icons/menIcon';
import Button from '@/compoents/button';
import DownloadIcon from '@/icons/downloadIcon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { purchasedCourses } from '@/compoents/api/algobot';
import Pagination from '@/compoents/pagination';
const ITEMS_PER_PAGE = 8;

export default function PhysicalEvents() {
    const [physicalCourses, setPhysicalCourses] = useState([]);
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
                const response = await purchasedCourses({ type: "PHYSICAL", page: pagination.currentPage, limit: ITEMS_PER_PAGE });
                if (response && response.success) {
                    setPhysicalCourses(response.payload.PHYSICAL);
                    setPagination((prev) => ({
                        ...prev,
                        currentPage: 1,
                        totalItems: response.payload.PHYSICAL?.length,
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
    // Loading skeleton for physical events
    const renderSkeletons = (count = 3) => {
        return Array(count).fill(0).map((_, i) => (
            <div className={styles.cardgridItems} key={`skeleton-${i}`}>
                <Skeleton height={36} width={100} style={{ marginBottom: '16px' }} />
                <Skeleton height={24} width="80%" style={{ marginBottom: '8px' }} />
                <Skeleton height={20} width="60%" style={{ marginBottom: '24px' }} />
                <Skeleton height={80} style={{ marginBottom: '16px' }} />
                <Skeleton height={40} style={{ marginBottom: '16px' }} />
            </div>
        ));
    };

    // Empty state component
    const renderEmptyState = () => (
        <div className={styles.emptyState}>
            <EmptyState
                title="No Physical Events Available"
                description="You haven't enrolled in any Physical Events yet."
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
        <div className={styles.physicalEventsAlignment}>
            {loading ? (
                <div className={styles.cardgrid}>
                    {renderSkeletons()}
                </div>
            ) : physicalCourses?.length === 0 ? (
                renderEmptyState()
            ) : (
                <div className={styles.cardgrid}>
                    {physicalCourses?.map((event, index) => (
                        <Link href={`/my-courses/course/${event?.courseId?._id}`} key={index}>
                            <div className={styles.cardgridItems} >
                                <div className={styles.cardgridItemsimage}>
                                    <img src={event?.courseId?.courseVideo
                                    } alt="" />
                                </div>
                                <div className={styles.content}>
                                    <h3>{event?.courseId?.CourseName || 'Event Name'}</h3>
                                    <div className={styles.icontext}>
                                        <MenIcon />
                                        <span>{event?.courseId?.instructor || 'Instructor Name'}</span>
                                    </div>
                                </div>
                                <div className={styles.textgrid}>
                                    <div className={styles.textgridItemsleft}>
                                        <h4>Location</h4>
                                        <p title={event?.courseId.location || 'Location not specified'}>
                                            {event?.courseId.location || 'Location not specified'}
                                        </p>
                                    </div>
                                    <div className={styles.textgridItems}>
                                        <h4>Schedule</h4>
                                        {/* <p>{new Date(event?.courseId.courseStart).toLocaleDateString() || 'Date not specified'}</p> */}
                                        <div className={styles.clockText}>
                                            <ClockGreyIcon />
                                            <p>{`${new Date(event?.courseId.courseStart).toLocaleDateString()} - ${new Date(event?.courseId.courseEnd).toLocaleDateString()}` || 'Time not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                    <div className={styles.infoCard}>


                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Purchased On:</span>
                                            <span className={styles.infoValue}>{new Date(event?.createdAt).toLocaleDateString()}</span>
                                        </div>

                                    </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <Pagination
                currentPage={pagination.currentPage}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
