import React from 'react';
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

export default function LiveSessions({ liveCourses = [], isLoading = false, error = null }) {
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
            <div className={styles.emptyImage}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#9CA3AF" />
                </svg>
            </div>
            <h3>No Live Sessions Available</h3>
            <p>There are no live sessions scheduled at the moment. Please check back later.</p>
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
                {isLoading ? (
                    renderSkeletons(2)
                ) : liveCourses.length === 0 ? (
                    renderEmptyState()
                ) : (
                    liveCourses.map((liveCourse, index) => (
                        <div className={styles.cardgridItems} key={index}>
                            <Button text="Upcoming" />
                            <div className={styles.content}>
                                <h3>{liveCourse?.courseId?.courseName}</h3>
                                <div className={styles.icontext}>
                                    <MenIcon />
                                    <span>{liveCourse?.courseId?.instructor}</span>
                                </div>
                            </div>
                            <div className={styles.bottomContentAlignment}>
                                <div className={styles.nextsession}>
                                    <p>Next Live Session</p>
                                    <div className={styles.twoIconTextAlignment}>
                                        <div className={styles.textIcon}>
                                            <DateIcon />
                                            <span>{liveCourse?.courseId?.startDate}</span>
                                        </div>
                                        <div className={styles.textIcon}>
                                            <ClockGreyIcon />
                                            <span>{liveCourse?.courseId?.startTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.mettingContent}>
                                    <DownloadPrimaryIcon />
                                    <span>Get Meeting Link</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Previous Recordings */}
            
            <div className={styles.sessionGrid}>
                {isLoading ? (
                    <div className={styles.sessionGridItems}>
                        <div className={styles.content}>
                            <Skeleton height={24} width="80%" style={{ marginBottom: '12px' }} />
                            <Skeleton height={16} width="60%" count={2} />
                        </div>
                        <Skeleton height={20} width={80} />
                    </div>
                ) : liveCourses.length > 0 ? (
                    <>
                    <div className={styles.title}>
                        <h2>Previous Recordings</h2>
                    </div>
                    {liveCourses.map((liveCourse, index) => (
                        <div className={styles.sessionGridItems} key={index}>
                            <div className={styles.content}>
                                <h3>{liveCourse?.courseId?.CourseName}</h3>
                                <div className={styles.twoIcontext}>
                                    <div className={styles.iconText}>
                                        <DateIcon />
                                        <span>{liveCourse?.courseId?.startDate}</span>
                                    </div>
                                    <div className={styles.iconText}>
                                        <ClockGreyIcon />
                                        <span>{liveCourse?.courseId?.startTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.watchText}>
                                <PlayIcon />
                                <span>Watch</span>
                            </div>
                        </div>
                    ))}
                    </>
                ) : null}
            </div>
        </div>
    );
}
