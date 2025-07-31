import React from 'react'
import styles from './courseDetails.module.scss';
import ClockIcon from '@/icons/clockIcon';
import BathIcon from '@/icons/bathIcon';
import StarIcon from '@/icons/starIcon';
import UserIcon from '@/icons/userIcon';
import ProfileI from '@/icons/profileI';
import ProfileGroupIcon from '@/icons/profileGroupIcon';
export default function CourseDetails() {
    return (
        <div className={styles.courseDetailsBox}>
            <div className={styles.textStyle}>
                <h3>Crypto Currency for Beginners</h3>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s.
                </p>
                <div className={styles.allIconTextAlignment}>
                    <div className={styles.iconText}>
                        <ClockIcon />
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
                <div className={styles.tabAlignment}>
                    <button>Chapter 1</button>
                    <button>Chapter 2</button>
                    <button>Chapter 3</button>
                    <button>Chapter 4</button>
                    <button>Chapter 5</button>
                    <button>Chapter 6</button>
                    <button>Chapter 7</button>
                </div>
                <div className={styles.mainGrid}>
                    <div className={styles.items}>
                        <div className={styles.image}></div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.details}>
                            <h4>
                                Chapter 1 : This line is written for dummy text.
                            </h4>
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
        </div>
    )
}

