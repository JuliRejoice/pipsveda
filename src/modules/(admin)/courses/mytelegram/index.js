import React, { useState, useEffect } from 'react'
import styles from './mytelegram.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import ArrowVec from '@/icons/arrowVec';
import Pagination from '@/compoents/pagination';
import { purchasedCourses } from '@/compoents/api/algobot';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;

const calculateExpiryDate = (createdAt, planType) => {
  if (!createdAt) return 'N/A';
  
  const purchaseDate = new Date(createdAt);
  const expiryDate = new Date(purchaseDate);
  
  // Map plan types to their respective durations in months
  const planDurations = {
    'MONTHLY': 1,
    'QUARTERLY': 3,
    'HALF_YEARLY': 6,
    'YEARLY': 12,
    'LIFETIME': 1200, 
  };
  
  const monthsToAdd = planDurations[planType] || 1; // Default to 1 month if plan type not found
  expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
  
  return expiryDate.toLocaleDateString();
};

function MyTelegram() {
    const [telegramCourses, setTelegramCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE,
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await purchasedCourses({ type: "TELEGRAM", page: pagination.currentPage, limit: ITEMS_PER_PAGE });
                if (response && response.success) {
                    setTelegramCourses(response.payload.TELEGRAM);
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


    if (loading) {
        return (
            <div className={styles.myAlgobots}>
                <div className={styles.cardgrid}>
                    {[...Array(4)].map((_, index) => (
                        <div key={`skeleton-${index}`} className={styles.cardgridItems}>

                            <div className={styles.details}>
                                <h3>
                                    <Skeleton width="100%" height={23} />
                                </h3>
                                <h4>
                                    <Skeleton width="100%" height={22} />
                                </h4>
                                <p>
                                    <Skeleton width="100%" height={20} />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    const renderEmptyState = () => {
        return (
            <div className={styles.emptyState}>
                <EmptyState
                    title="No Telegram Found"
                    description="You haven't Subscribe any Telegram yet."
                />
            </div>
        );
    }

    return (
        <div className={styles.myAlgobots}>
            <div className={styles.cardgrid}>
                {telegramCourses?.length === 0 ? (
                    renderEmptyState()
                ) : (
                    telegramCourses?.map((telegramCourse, index) => (
                        <Link href={`/my-courses/telegram/${telegramCourse?.telegramId?.telegramId?._id}`} key={telegramCourse?.telegramId?._id || index}>
                            <div className={styles.cardgridItems}>
                                <div className={styles.details}>
                                    <div className={styles.title}>
                                        <div className={styles.textStyle}>
                                            <h3>{telegramCourse?.telegramId?.telegramId.channelName}</h3>

                                        </div>
                                        <ArrowVec />
                                    </div>
                                    <h4>Plan: {telegramCourse?.telegramId?.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2')?.replace(/_/g, ' ')}</h4>
                                    <p>{telegramCourse?.telegramId?.telegramId.description}</p>
                                </div>
                            </div>
                        </Link>
                    )

                    )

                )}
            </div>
            <Pagination
                currentPage={pagination.currentPage}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default MyTelegram