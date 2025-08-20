import React from 'react'
import styles from './courseDetailsBanner.module.scss';
export default function CourseDetailsBanner() {
    return (
        <div className={styles.courseDetailsBanner}>
            <div className='container'>
                <h1>
                    Crypto Currency for Beginners
                </h1>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
            </div>
        </div>
    )
}
