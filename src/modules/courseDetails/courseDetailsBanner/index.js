import React from 'react'
import styles from './courseDetailsBanner.module.scss';
export default function CourseDetailsBanner() {
    return (
        <div className={styles.courseDetailsBanner}>
            <div className='container'>
                <h1>
                    Forex Trading for Beginners
                </h1>
                <p>
                    A simple guide to understanding and starting currency trading in the global forex market.
                </p>
            </div>
        </div>
    )
}
