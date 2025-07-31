import React from 'react'
import styles from './breadcumbs.module.scss';
import RightMdcon from '@/icons/rightMdcon';
import Link from 'next/link';
export default function Breadcumbs() {
    return (
        <div className={styles.breadcumbsAlignment}>
            <Link href="/">Home</Link>
            <RightMdcon />
            <Link href="/dashboard">Course</Link>
            <RightMdcon />
            <span>Pre-Recorded</span>

        </div>
    )
}
