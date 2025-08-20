import React from 'react'
import styles from './blogDetailsBanner.module.scss';
const HomeIcon = '/assets/icons/home.svg';
const RightIcon = '/assets/icons/right-black-sm.svg';
export default function BlogDetailsBanner() {
    return (
        <div className={styles.blogDetailsBanner}>
            <div className='container'>
                <div className={styles.breadcumbAlignment}>
                    <img src={HomeIcon} alt="HomeIcon" />
                    <img src={RightIcon} alt="RightIcon" />
                    <span className={styles.lightText}>Blog</span>
                    <img src={RightIcon} alt="RightIcon" />
                    <span>Blog Details</span>
                </div>
                <h2>
                    5 Essential Risk Management Strategies for Day Trading
                </h2>
            </div>
        </div>
    )
}
