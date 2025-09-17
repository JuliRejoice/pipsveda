import React from 'react'
import styles from './faqBanner.module.scss';
export default function FaqBanner() {
    return (
        <div className={styles.faqBanner}>
            <div className='container'>
                <div className={styles.text}>
                    <h1>
                        Frequently Asked Questions
                    </h1>
                    <p>
                        Get quick answers about our trading tools, courses, and support. Need help? Contact our team anytime.
                    </p>
                </div>
            </div>
        </div>
    )
}