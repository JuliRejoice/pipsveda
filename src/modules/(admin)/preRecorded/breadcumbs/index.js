import React from 'react'
import styles from './breadcumbs.module.scss';
import RightMdcon from '@/icons/rightMdcon';
import Link from 'next/link';
export default function Breadcumbs() {
    return (
        <div className={styles.breadcumbsAlignment}>
            <span><Link href="/">Home</Link></span>
            <RightMdcon />
            <span><Link href="/dashboard">Course</Link></span>
            <RightMdcon />
            <span>Pre-Recorded</span>

        </div>
    )
}
