'use client'
import React from 'react'
import styles from './recentCourse.module.scss';
import Skeleton from 'react-loading-skeleton';

function RenderSkeleton() {
  return Array(4).fill(0).map((_, index) => (
            <div className={styles.griditems} key={`skeleton-${index}`}>
                <Skeleton height={200} className={styles.skeletonImage} />
                <div className={styles.details}>
                    <Skeleton height={24} width="80%" />
                    <Skeleton count={2} style={{ marginTop: '10px' }} />
                    <div className={styles.twoContentAlignment} style={{ marginTop: '15px' }}>
                        <Skeleton width={80} height={20} />
                        <Skeleton width={100} height={20} />
                    </div>
                    <Skeleton height={40} style={{ marginTop: '15px' }} />
                </div>
            </div>
        ));
}

export default RenderSkeleton