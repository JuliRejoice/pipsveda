import React from 'react'
import styles from './trendingCourse.module.scss';
import ClockIcon from '@/icons/clockIcon';
import BathIcon from '@/icons/bathIcon';
import StarIcon from '@/icons/starIcon';
import ProfileI from '@/icons/profileI';
import User from '@/icons/user';
import CommonButton from '@/compoents/commonButton';
const CourseImage = '/assets/images/course-img.png';
export default function TrendingCourse() {
  return (
    <div className={styles.trendingCourse}>
      <div className={styles.title}>
        <h3>Trending Course</h3>
      </div>
      <div className={styles.cardgrid}>
        <div className={styles.cardGriditems}>
            <h4>Crypto Currency for Beginners</h4>
            <div className={styles.textgrid}>
                <div>
                    <ClockIcon/>        
                    <span>12 hours</span>            
                </div>
                <div>
                    <BathIcon/>        
                    <span>John  Doe</span>            
                </div>
                <div>
                    <StarIcon/>        
                    <span>4.8</span>            
                </div>
                <div>
                    <User/>     
                    <span>1234</span>            
                </div>
            </div>
            <p>
                Last-Update: 21-6-25  |  English
            </p>
            <h6>$789</h6>
            <div className={styles.btnAlignment}>
            <CommonButton text="Enroll Now"/>
            </div>
        </div>
        <div className={styles.cardGriditems}>
            <div className={styles.image}>
                <img src={CourseImage} alt='CourseImage'/>
            </div>
        </div>
      </div>
    </div>
  )
}
