'use client'
import React, { useEffect, useState } from 'react'
import styles from './recentCourse.module.scss';
import Button from '@/compoents/button';
import OutlineButton from '@/compoents/outlineButton';
import { getCourseById, getCourseByType, getCourses } from '@/compoents/api/dashboard';
import RenderSkeleton from '@/modules/(admin)/chapter/recentCourse/RenderSkeleton';
const CardImage = '/assets/images/course-details-card.png';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';
const BathIcon = '/assets/icons/bath-new.svg';
const RightIcon = '/assets/icons/right-black.svg';
export default function RecentCourse({id}) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router=useRouter()
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await getCourseById({id});
                const res = await getCourseById({courseType:response.payload.data[0].courseType});
                const responseCourses = res.payload.data;
                const filterCourses = responseCourses.filter((course) => course._id !== id);
                setCourses(filterCourses);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [id]);

    return (
        <div className={styles.recentCourse}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Similar Courses
                    </h2>
                </div>
                <div className={styles.grid}>
                    {loading ? (
                        <RenderSkeleton count={3} />
                    ) : (
                        courses?.map((course, index) => {
                            return (
                                <div className={styles.griditems} key={index}>
                                    <div className={styles.image}>
                                        <img src={course?.courseVideo} alt="CardImage" />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>
                                            {course?.CourseName}
                                        </h3>
                                        <p>
                                            {course?.description}
                                        </p>
                                        <div className={styles.twoContentAlignment}>
                                            <h4>
                                                ${course?.price}
                                            </h4>
                                            <div className={styles.iconText}>
                                                <img src={BathIcon} alt="BathIcon" />
                                                <span>{course?.instructor?.name}</span>
                                            </div>
                                        </div>
                                        <OutlineButton text="Enroll Now" icon={RightIcon} onClick={() => router.push(`/course-details?id=${course?._id}`)}/>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
