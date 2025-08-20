import React from 'react'
import styles from './recentCourse.module.scss';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';
const CardImage = '/assets/images/course-details-card.png';
const BathIcon = '/assets/icons/bath-primary.svg';
const RightIcon = '/assets/icons/right-black.svg';
export default function RecentCourse() {
    return (
        <div className={styles.recentCourse}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Recent Course
                    </h2>
                </div>
                <div className={styles.grid}>
                    {
                        [...Array(3)].map(() => {
                            return (
                                <div className={styles.griditems}>
                                    <div className={styles.image}>
                                        <img src={CardImage} alt="CardImage" />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>
                                            Crypto Currency for Beginners
                                        </h3>
                                        <p>
                                            Lorem Ipsum has been the industry's standard dummy text
                                            ever...
                                        </p>
                                        <div className={styles.twoContentAlignment}>
                                            <h4>
                                                $789
                                            </h4>
                                            <div className={styles.iconText}>
                                                <img src={BathIcon} alt="BathIcon" />
                                                <span>John  Doe</span>
                                            </div>
                                        </div>
                                        <OutlineButton text="Enroll Now" icon={RightIcon} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
