import React from 'react';
import styles from './pagination.module.scss';
import LeftIcon from '@/icons/leftIcon';

export default function Pagination({ 
  currentPage = 1, 
  totalItems = 0, 
  itemsPerPage = 10, 
  onPageChange = () => {},
  maxVisiblePages = 5
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <div key={1} className={styles.pageNumber} onClick={() => handlePageChange(1)}>
          1
        </div>
      );
      if (startPage > 2) {
        pages.push(
          <div key="ellipsis-start" className={styles.ellipsis}>
            ...
          </div>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <div 
          key={i} 
          className={`${styles.pageNumber} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </div>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <div key="ellipsis-end" className={styles.ellipsis}>
            ...
          </div>
        );
      }
      pages.push(
        <div 
          key={totalPages} 
          className={styles.pageNumber} 
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </div>
      );
    }

    return pages;
  };

  return (
    <div className={styles.paginationAlignment}>
      <div 
        className={`${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <LeftIcon />
      </div>
      <div className={styles.counterAlignment}>
        {renderPageNumbers()}
      </div>
      <div 
        className={`${styles.arrow} ${styles.right} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <LeftIcon />
      </div>
    </div>
  );
}
