import React from 'react'
import styles from './recentCourse.module.scss';
import BathIcon from '@/icons/bathIcon';
import CommonButton from '@/compoents/commonButton';
const CardImage = '/assets/images/card10.png';
export default function RecentCourse() {
    return (
        <div className={styles.recentCourse}>
            <div className={styles.title}>
                <h3>
                    Recent Course
                </h3>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(4)].map((_, i) => {
                        return (
                            <div className={styles.griditems} key={i}>
                                <div className={styles.image}>
                                    <div className={styles.img}>
                                        <img src={CardImage} alt='CardImage' />
                                    </div>
                                    <div className={styles.details}>
                                        <h4>Crypto Currency for Beginners</h4>
                                        <div className={styles.iconText}>
                                            <BathIcon />
                                            <span>
                                                John  Doe
                                            </span>
                                        </div>
                                        <div className={styles.textbuttonAlignment}>
                                            <h6>$789</h6>
                                            <CommonButton text="Enroll Now" outline />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
