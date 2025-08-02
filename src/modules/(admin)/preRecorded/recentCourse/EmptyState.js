'use client'
import React from "react";
import styles from './recentCourse.module.scss';

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyImage}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
            fill="#9CA3AF"
          />
        </svg>
      </div>
      <h3>No Courses Available</h3>
      <p>
        There are no courses to display at the moment. Please check back later.
      </p>
    </div>
  );
}

export default EmptyState;
