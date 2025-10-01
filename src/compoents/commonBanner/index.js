import React from 'react'
import styles from './commonBanner.module.scss';
export default function CommonBanner({ title, description }) {
    return (
        <div className={styles.leftrightSpacing}>
            <div className={styles.commonBanner}>
                <div className='container'>
                    <h1>{title}</h1>
                    <p>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}
