import React from 'react'
import styles from './blogDetailsBanner.module.scss';
import Link from 'next/link';
const HomeIcon = '/assets/icons/home.svg';
const RightIcon = '/assets/icons/right-black-sm.svg';
export default function BlogDetailsBanner({title}) {
    return (
        <div className={styles.blogDetailsBanner}>
            <div className='container'>
                <div className={styles.breadcumbAlignment}>
                    <img src={HomeIcon} alt="HomeIcon" />
                    <img src={RightIcon} alt="RightIcon" />
                    <span className={styles.lightText}><Link href='/blog' style={{textDecoration: 'none', color: 'inherit'}}>Blog</Link></span>
                    <img src={RightIcon} alt="RightIcon" />
                    <span>Blog Details</span>
                </div>
                <h2>
                    {title}
                </h2>
            </div>
        </div>
    )
}
