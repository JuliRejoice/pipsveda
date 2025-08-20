import React from 'react'
import styles from './ourCourseBanner.module.scss';
const CardImage = '/assets/images/card1.png'
export default function OurCourseBanner() {
    return (
        <div className={styles.ourCourseBanner}>
            <div className='container'>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <h2>
                            Our Course
                        </h2>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
                            a type specimen book.
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.image}>
                            <img src={CardImage} alt="CardImage" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
