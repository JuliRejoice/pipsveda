import React, { useState, useEffect } from 'react'
import styles from './myAlgobots.module.scss';
import Button from '@/compoents/button';
import DateIcon from '@/icons/dateIcon';
import DownloadIcon from '@/icons/downloadIcon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';

export default function MyAlgobots({ algobotCourses, isLoading = false }) {
  // State to track if we're showing skeleton (initial load)
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
              <div className={styles.image}>
                <Skeleton width="100%" height={220} className={styles.imageSkeleton} />
              </div>
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

  // Empty state
  const renderEmptyState = () => {
    return (
      <div className={styles.emptyState}>
        <EmptyState
          title="No Algobots Found"
          description="You haven't Buy any algobots yet."
        />
      </div>
    );
  }

  // Main content
  return (
    <div className={styles.myAlgobots}>
      <div className={styles.cardgrid}>
        {algobotCourses?.length === 0 ? (
          renderEmptyState()
        ) : (


          algobotCourses?.map((algobotCourse, index) => (
            <div key={algobotCourse?.botId?._id || index} className={styles.cardgridItems}>
              <div className={styles.image}>
                <img src={algobotCourse?.botId?.strategyId.imageUrl} alt='image' />
              </div>
              <div className={styles.details}>
                <h3>{algobotCourse?.botId?.strategyId.title}</h3>
                <h4>Plans : {algobotCourse?.botId?.planType}</h4>
                <p>{algobotCourse?.botId?.strategyId.shortDescription}</p>
              </div>
              {/* <Button text="Pending Setup" />
            <div className={styles.twoContentAlignment}>
              <div>
                <p>{algobotCourse?.botId?.botName}</p>
                <span className={styles.spanStyle}>{algobotCourse?.botId?.botType || "High-Frequency Scalping"}</span>
              </div>
              <div className={styles.dateShow}>
                <DateIcon />
                <span className={styles.spanStyle}>
                  {algobotCourse?.botId?.createdAt 
                    ? new Date(algobotCourse.botId.createdAt).toLocaleDateString('en-GB') 
                    : "08/08/2025"}
                </span>
              </div>
            </div>
            <div className={styles.alltextStyle}>
              <div>
                <p>Return</p>
                <span>+15.8%</span>
              </div>
              <div>
                <p>Win Rate</p>
                <span>78%</span>
              </div>
              <div>
                <p>Trades</p>
                <span>145</span>
              </div>
            </div> */}
              {/* <div className={styles.downloadContent}>
              <DownloadIcon />
              <span>Download Now</span>
            </div> */}
            </div>
          )))}
      </div>
    </div>
  );
}
