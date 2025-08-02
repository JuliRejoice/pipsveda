import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './courseBanner.module.scss';

const CourseCardSkeleton = ({ count = 3 }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div
                    key={`skeleton-${i}`}
                    className={`${styles.card} ${i > 0 ? styles.hideOnMobile : ''}`}
                >
                    <div className={styles.image}>
                        <Skeleton
                            className={styles.skeletonImage}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={styles.details}>
                        <h3><Skeleton width="80%" height={24} /></h3>
                        <div className={styles.iconText} style={{ padding: '0' }}>
                            <Skeleton circle={true} width={20} height={20} style={{ minWidth: 20 }} />
                            <span><Skeleton width={100} height={16} /></span>
                        </div>
                        <div className={styles.lastContentAlignment}>
                            <h4><Skeleton width={60} height={22} /></h4>
                            <div className={styles.iconText}>
                                <p><Skeleton width={80} height={20} /></p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CourseCardSkeleton;
