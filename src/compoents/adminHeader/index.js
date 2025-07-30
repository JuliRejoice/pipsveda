import React from 'react'
import styles from './adminHeader.module.scss';
export default function AdminHeader() {
  return (
    <div className={styles.adminHeader}>
      <h2>
        Hello Ahmad, welcome!
      </h2>
      <p>
        Your monetisation journey on TagMango starts here!
      </p>
    </div>
  )
}

