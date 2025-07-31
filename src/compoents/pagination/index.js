import React from 'react'
import styles from './pagination.module.scss';
import LeftIcon from '@/icons/leftIcon';
export default function Pagination() {
  return (
    <div className={styles.paginationAlignment}>
      <div className={styles.arrow}>
        <LeftIcon/>
      </div>
      <div className={styles.counterAlignment}>
        <div>1</div>
        <div>2</div>
        <div>...</div>
        <div>4</div>
        <div>5</div>
      </div>
        <div className={styles.arrow}>
        <LeftIcon/>
      </div>
    </div>
  )
}
