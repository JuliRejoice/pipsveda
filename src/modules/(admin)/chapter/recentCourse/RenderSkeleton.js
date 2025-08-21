'use client'
import React from 'react'
import styles from './recentCourse.module.scss';
import Skeleton from 'react-loading-skeleton';

function RenderSkeleton({count}) {
  return Array(count).fill(0).map((_, index) => (
            <div className={styles.griditems} key={`skeleton-${index}`}>
                <Skeleton height={200} className={styles.skeletonImage} />
                <div className={styles.details}>
                    <Skeleton height={24} width="80%" />
                    <Skeleton count={2} style={{ marginTop: '10px' }} />
                    <div className={styles.twoContentAlignment} style={{ marginTop: '15px' , display: 'flex',gap: '10px' }}>
                        <Skeleton width={80} height={20} />
                        <Skeleton width={100} height={20} />
                    </div>
                    <Skeleton height={40} width={200} style={{ marginTop: '15px' }} />
                </div>
            </div>
        ));
}

export default RenderSkeleton