import React from 'react'
import styles from './breadcumbs.module.scss';
import RightMdcon from '@/icons/rightMdcon';
export default function Breadcumbs() {
    return (
        <div className={styles.breadcumbsAlignment}>
            <span>Home</span>
            <RightMdcon />
            <span>Course</span>
            <RightMdcon />
            <span>Pre-Recorded</span>

        </div>
    )
}
