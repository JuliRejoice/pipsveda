import React from 'react'
import styles from './courseInformation.module.scss';
import ClockIcon from '@/icons/clockIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import BathIcon from '@/icons/bathIcon';
import StarIcon from '@/icons/starIcon';
import ProfileGroupIcon from '@/icons/profileGroupIcon';
import Button from '@/compoents/button';
const RightIcon = '/assets/icons/right.svg';
export default function CourseInformation() {
    return (
        <div className={styles.courseInformation}>
            <div className='container'>
                <div className={styles.courseHeaderAlignment}>
                    <div className={styles.textAlignment}>
                        <h2>
                            Crypto Currency for Beginners
                        </h2>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                            the 1500s.
                        </p>
                        <div className={styles.allIconTextAlignment}>
                            <div className={styles.iconText}>
                                <ClockGreyIcon />
                                <span>12 hours</span>
                            </div>
                            <div className={styles.iconText}>
                                <BathIcon />
                                <span>John  Doe</span>
                            </div>
                            <div className={styles.iconText}>
                                <StarIcon />
                                <span>4.8</span>
                            </div>
                            <div className={styles.iconText}>
                                <ProfileGroupIcon />
                                <span>1234</span>
                            </div>
                            <div className={styles.iconText}>
                                <span>Last-Update: 21-6-25  |  English</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.rightContentAlignment}>
                        <h4>
                            $789
                        </h4>
                        <Button text='Enroll Now' icon={RightIcon} />
                    </div>
                </div>
                <div className={styles.tabAlignment}>
                    <button className={styles.activeTab}>Chapter 1</button>
                    <button>Chapter 2</button>
                    <button>Chapter 3</button>
                    <button>Chapter 4</button>
                    <button>Chapter 5</button>
                    <button>Chapter 6</button>
                    <button>Chapter 7</button>
                </div>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.videoPlayer}></div>
                    </div>
                    <div className={styles.griditems}>
                        <h3>
                            Chapter 1 : This line is written for dummy text.
                        </h3>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
                            to make.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
                            to make.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
                            to make.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
