'use client'
import React from 'react'
import styles from './adminHeader.module.scss';
import { getCookie } from '../../../cookie';
export default function AdminHeader() {
    const user = getCookie('user');
   const userName=(JSON.parse(user)?.name);
  return (
    <div className={styles.adminHeader}>
      <h2>
        Hello {userName}, welcome!
      </h2>
      <p>
        Your monetisation journey on TagMango starts here!
      </p>
    </div>
  )
}

