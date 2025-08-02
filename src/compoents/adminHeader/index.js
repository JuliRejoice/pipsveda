'use client'
import React, { useEffect, useState } from 'react'
import styles from './adminHeader.module.scss';
import { getCookie } from '../../../cookie';
export default function AdminHeader() {
  const [user,setUser]= useState(null);
useEffect(() => {
    const user = getCookie('user');
    const userName=(user && JSON.parse(user)?.name);
   setUser(userName);
  }, []);
  return (
    <div className={styles.adminHeader}>
      <h2>
        Hello {user}, welcome!
      </h2>
      <p>
        Your monetisation journey on TagMango starts here!
      </p>
    </div>
  )
}

