'use client'
import React, { useEffect, useState } from 'react'
import styles from './courseInformation.module.scss';
import ClockIcon from '@/icons/clockIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import BathIcon from '@/icons/bathIcon';
import StarIcon from '@/icons/starIcon';
import ProfileGroupIcon from '@/icons/profileGroupIcon';
import Button from '@/compoents/button';
import { getChapters, getCourseById, getCourses, getCourseSyllabus, getPaymentUrl } from '@/compoents/api/dashboard';
import { getCookie } from '../../../../cookie';
import { useRouter } from 'next/navigation';
import CustomVideoPlayer from '@/compoents/CustomVideoPlayer';
const RightIcon = '/assets/icons/right.svg';
const LockIcon = '/assets/icons/lock.svg';
export default function CourseInformation({ id }) {
  const [course, setCourse] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const [syllabus, setSyllabus] = useState([]);
   const [expandedSection, setExpandedSection] = useState(null);


    const fetchSyllabus = async () => {
    try {
      const data = await getCourseSyllabus(id);
      // The API returns an array of syllabus items, we'll take the first one as the main syllabus
      const syllabusData = data?.payload?.data;
      setSyllabus(syllabusData);
    } catch (err) {
      console.error("Error fetching syllabus:", err);
      setError("Failed to load course syllabus. Please try again later.");
    }
  };

  useEffect(() => {
  
    const fetchCourse = async () => {
      try {
        const response = await getCourseById({id});
        setCourse(response.payload.data[0]);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
    fetchSyllabus();
    const userToken = getCookie('userToken');
    if (userToken) {
      setIsLogin(true);
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

  console.log(course)

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
                <span>{course?.instructor?.name}</span>
              </div>
              <div className={styles.iconText}>
                {/* <StarIcon />
                <span>4.8</span> */}
              </div>
              <div className={styles.iconText}>
                <ProfileGroupIcon />
                <span>{course?.subscribed || '0'}</span>
              </div>
              <div className={styles.iconText}>
                <span>Last-Update: {new Date(course?.updatedAt || new Date()).toLocaleDateString('en-GB')} | {course?.language?.slice(0, 1).toUpperCase() + course?.language?.slice(1) || 'English'}</span>
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

         <div className={styles.introVideo}>
           
              <CustomVideoPlayer
                src={course?.courseIntroVideo}
                // userId={user?._id}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                noremoteplayback
              />
           
          </div>

           {syllabus.length > 0 && (
            <div className={styles.syllabusContainer}>
              <h2>Course Syllabus</h2>
              <div className={styles.accordion}>
                {syllabus.map((item, index) => (
                  <div key={index} className={styles.accordionItem}>
                    <div
                      className={`${styles.accordionHeader} ${expandedSection === index ? styles.active : ''}`}
                      onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                    >
                      <h2>Chapter {index + 1} : {item.title}</h2>
                      <span>{expandedSection === index ? '−' : '+'}</span>
                    </div>
                    <div className={`${styles.accordionContent} ${expandedSection === index ? styles.active : ''}`}>
                      <div className={styles.chapterContent}>
                        <p>{item.description || 'No description available for this chapter.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        {/* {!course.isPayment ? 
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
         : null} */}
      </div>
    </div>
  )
}
