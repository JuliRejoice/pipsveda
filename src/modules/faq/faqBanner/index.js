import React from 'react'
import styles from './faqBanner.module.scss';
export default function FaqBanner() {
    return (
        <div className={styles.faqBanner}>
            <div className='container'>
                <div className={styles.text}>
                    <h1>
                        Frequently Ask Question
                    </h1>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
            </div>
        </div>
    )
}
