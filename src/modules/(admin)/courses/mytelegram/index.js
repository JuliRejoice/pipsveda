import React, { useState, useEffect } from 'react'
import styles from './mytelegram.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import ArrowVec from '@/icons/arrowVec';


function MyTelegram({ telegramCourses, isLoading }) {

    const [showSkeleton, setShowSkeleton] = useState(true);

    // Hide skeleton after initial data load
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowSkeleton(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // Loading state
    if (isLoading || showSkeleton) {
        return (
            <div className={styles.myAlgobots}>
                <div className={styles.cardgrid}>
                    {[...Array(3)].map((_, index) => (
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

    console.log(telegramCourses)
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
        </div>
    )
}

export default MyTelegram