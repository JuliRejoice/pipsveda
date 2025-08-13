import React from 'react';
import styles from './physicalEvents.module.scss';
import DownloadPrimaryIcon from '@/icons/downloadPrimaryIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import DateIcon from '@/icons/dateIcon';
import MenIcon from '@/icons/menIcon';
import Button from '@/compoents/button';
import DownloadIcon from '@/icons/downloadIcon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PhysicalEvents({ physicalCourses = [], isLoading = false, error = null }) {
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
            <div className={styles.emptyImage}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#9CA3AF" />
                </svg>
            </div>
            <h3>No Physical Events Scheduled</h3>
            <p>There are no upcoming physical events at the moment. Please check back later.</p>
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
            {isLoading ? (
                <div className={styles.cardgrid}>
                    {renderSkeletons()}
                </div>
            ) : physicalCourses.length === 0 ? (
              renderEmptyState()
            ) : (
                <div className={styles.cardgrid}>
                    {physicalCourses.map((event, index) => (
                        <div className={styles.cardgridItems} key={index}>
                            <Button text="Upcoming" />
                            <div className={styles.content}>
                                <h3>{event?.courseId?.courseName || 'Event Name'}</h3>
                                <div className={styles.icontext}>
                                    <MenIcon />
                                    <span>{event?.courseId?.instructor || 'Instructor Name'}</span>
                                </div>
                            </div>
                            <div className={styles.textgrid}>
                                <div className={styles.textgridItems}>
                                    <h4>Location</h4>
                                    <p>
                                        {event?.location || 'Location not specified'}
                                    </p>
                                </div>
                                <div className={styles.textgridItems}>
                                    <h4>Schedule</h4>
                                    <p>{event?.date || 'Date not specified'}</p>
                                    <div className={styles.clockText}>
                                        <ClockGreyIcon/>    
                                        <p>{event?.time || 'Time not specified'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.downlodIcon}>
                                <DownloadIcon/>    
                                <span>Download Details</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
