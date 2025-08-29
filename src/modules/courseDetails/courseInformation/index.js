'use client'
import React, { useEffect, useState } from 'react'
import styles from './courseInformation.module.scss';
import ClockIcon from '@/icons/clockIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import BathIcon from '@/icons/bathIcon';
import StarIcon from '@/icons/starIcon';
import ProfileGroupIcon from '@/icons/profileGroupIcon';
import Button from '@/compoents/button';
import { getChapters, getCourses, getPaymentUrl } from '@/compoents/api/dashboard';
import { getCookie } from '../../../../cookie';
import { useRouter } from 'next/navigation';
const RightIcon = '/assets/icons/right.svg';
const LockIcon = '/assets/icons/lock.svg';
export default function CourseInformation({ id }) {
  const [course, setCourse] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await getChapters(id);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await getCourses({ id });
        setCourse(response.payload.data[0]);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
    const userToken = getCookie('userToken');
    if (userToken) {
      setIsLogin(true);
      fetchChapter();
    }
    else {
      setIsLogin(false);
    }
  }, [id]);
  const handlePayment = () => {
    if(isLogin){
      const payment = async () => {
        try {
          const response = await getPaymentUrl({ 
            success_url: 'https://pips-veda.vercel.app/my-courses',
            cancel_url: window.location.href,
            courseId: id
          });
          if(response.success){
            router.replace(response.payload.data.checkout_url);
          }
          else{
            toast.error("Payment failed. Please try again");
          }
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      }

      payment();
    }
    else{
      router.push('/signin')
    }
  }
  return (
    <div className={styles.courseInformation}>
      <div className='container'>
        <div className={styles.courseHeaderAlignment}>
          <div className={styles.textAlignment}>
            <h2>
              {course?.CourseName}
            </h2>
            <p>
              {course?.description}
            </p>
            <div className={styles.allIconTextAlignment}>
              <div className={styles.iconText}>
                <ClockGreyIcon />
                <span>{course?.hours} hours</span>
              </div>
              <div className={styles.iconText}>
                <BathIcon />
                <span>{course?.instructor}</span>
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
                <span>Last-Update: {new Date(course?.updatedAt || new Date()).toLocaleDateString('en-GB')} | English</span>
              </div>
            </div>
          </div>
          <div className={styles.rightContentAlignment}>
            <h4>
              ${course?.price}
            </h4>
            {course.isPayment ? '' : <Button text='Enroll Now' icon={RightIcon} onClick={() => handlePayment()} />}
          </div>
        </div>
        {!course.isPayment ? 
        <div className={styles.mainrelative}>
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
          {!course.isPayment && <div className={styles.locksystem}>
          <div>
            <div className={styles.iconCenter}>
              <img src={LockIcon} alt="LockIcon" />
            </div>
            <span>Enroll Now to unlock</span>
          </div>
        </div>}
        </div>
         : null}
      </div>
    </div>
  )
}
