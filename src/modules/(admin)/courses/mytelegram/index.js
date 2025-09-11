import React, { useState, useEffect } from 'react'
import styles from './mytelegram.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import ArrowVec from '@/icons/arrowVec';
import Pagination from '@/compoents/pagination';
import { purchasedCourses } from '@/compoents/api/algobot';

const ITEMS_PER_PAGE = 8;
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
                        <div key={telegramCourse?.telegramId?._id || index} className={styles.cardgridItems}>
                            {/* <div className={styles.image}>
                <img src={telegramCourse?.telegramId?.imageUrl} alt='image' />
              </div> */}
                            <div className={styles.details}>
                                {/* <h3>{telegramCourse?.telegramId?.telegramId.channelName}</h3>
                 */}
                                <div className={styles.title}>
                                    <div className={styles.textStyle}>
                                        <h3>{telegramCourse?.telegramId?.telegramId.channelName}</h3>

                                    </div>
                                    <ArrowVec />
                                </div>
                                <h4>Plans : {telegramCourse?.telegramId?.planType}</h4>
                                <p>{telegramCourse?.telegramId?.telegramId.description}</p>
                            </div>

                        </div>
                    )))}
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