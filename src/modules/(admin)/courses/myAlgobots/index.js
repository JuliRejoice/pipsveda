import React, { useState, useEffect } from 'react'
import styles from './myAlgobots.module.scss';
import Button from '@/compoents/button';
import DateIcon from '@/icons/dateIcon';
import DownloadIcon from '@/icons/downloadIcon';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import Pagination from '@/compoents/pagination';
import { purchasedCourses } from '@/compoents/api/algobot';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;
export default function MyAlgobots() {
  const [algobotCourses, setAlgobotCourses] = useState([]);
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
        const response = await purchasedCourses({ 
          type: "BOTS", 
          page: pagination.currentPage, 
          limit: pagination.itemsPerPage 
        });
        if (response && response.success) {
          setAlgobotCourses(response.payload.BOTS || []);
          setPagination(prev => ({
            ...prev,
            totalItems: response.payload.count || 0,
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
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (page) => {
    setPagination(prev => ({
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
            <Link href={`/algobot/${algobotCourse?.botId?.strategyId?._id}`} key={algobotCourse?.botId?._id || index}>
            <div  className={styles.cardgridItems}>
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
