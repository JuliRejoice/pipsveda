'use client'
import React, { useEffect, useState } from 'react'
import styles from './courses.module.scss';
import DownloadIcon from '@/icons/downloadIcon';
import LiveSessions from './liveSessions';
import PhysicalEvents from './physicalEvents';
import MyAlgobots from './myAlgobots';
import { purchasedCourses } from '@/compoents/api/algobot';
import EmptyState from '../chapter/recentCourse/EmptyState';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';
import MyTelegram from './mytelegram';
import Pagination from '@/compoents/pagination';
import Link from 'next/link';
import Breadcumbs from '../breadcumbs';

const TABS = {
    VIDEO_COURSES: 'Pre Recorded Courses',
    LIVE_SESSIONS: 'Live Online courses',
    PHYSICAL_EVENTS: 'In Person Courses',
    MY_ALGOBOTS: 'My AlgoBots',
    MY_TELEGRAM: 'My Telegram'
};

const ITEMS_PER_PAGE = 8;

const CourseSkeleton = () => {
    return Array(4).fill(0).map((_, index) => (
        <div key={`skeleton-${index}`} className={styles.griditems}>
            <div className={styles.cardImage}>
                <Skeleton height={220} className={styles.cardImageskl} style={{ borderRadius: '10px' }} />
            </div>
            <div className={styles.detailsAlignment}>
                <Skeleton height={24} width="80%" />
                <div className={styles.twoalignment}>
                    <div className={styles.text}>
                        <Skeleton circle width={22} height={22} style={{ marginRight: '8px' }} />
                        <Skeleton width={100} height={16} />
                    </div>
                    <div className={styles.text}>
                        <Skeleton circle width={22} height={22} style={{ marginRight: '8px' }} />
                        <Skeleton width={80} height={16} />
                    </div>
                </div>
            </div>
        </div>
    ));
};

export default function Courses() {
    const [activeTab, setActiveTab] = useState(TABS.VIDEO_COURSES);
    const [recordedCourses, setRecordedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await purchasedCourses({ type: "RECORDED", page: pagination.currentPage, limit: ITEMS_PER_PAGE });
                if (response && response.success) {
                    setRecordedCourses(response.payload.RECORDED);
                    setPagination((prev) => ({
                        ...prev,
                        currentPage: 1,
                        totalItems: response.payload.RECORDED.length,
                    }));
                } else {
                    throw new Error(response?.message || 'Failed to fetch courses');
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Failed to load courses');
                toast.error(err.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case TABS.LIVE_SESSIONS:
                return <LiveSessions />;
            case TABS.PHYSICAL_EVENTS:
                return <PhysicalEvents />;
            case TABS.MY_ALGOBOTS:
                return <MyAlgobots />;
            case TABS.MY_TELEGRAM:
                return <MyTelegram />;
            case TABS.VIDEO_COURSES:
            default:
                if (loading) {
                    return (
                        <div className={styles.grid}>
                            <CourseSkeleton />
                        </div>
                    );
                }

                return (
                    <div className={styles.grid}>
                        {recordedCourses.length === 0 ? (
                            <div className={styles.emptyState}>
                                <EmptyState
                                    title="No Courses Found"
                                    description="You haven't enrolled in any recorded courses yet."
                                />
                            </div>
                        ) : (
                            recordedCourses.map((recordedCourse, index) => (
                                <Link href={`/my-courses/course/${recordedCourse?.courseId?._id}`} key={index} >
                                    <div className={styles.griditems} >
                                        <div className={styles.cardImage}>
                                            <img src={recordedCourse?.courseId?.courseVideo} alt='CardImage' />
                                        </div>
                                        <div className={styles.detailsAlignment}>
                                            <h3>{recordedCourse?.courseId?.CourseName}</h3>
                                            <div className={styles.twoalignment}>
                                                <div className={styles.text}>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.66667 3.08333C2.66667 1.9325 3.59917 1 4.75 1C5.90083 1 6.83333 1.9325 6.83333 3.08333C6.83333 4.23417 5.90083 5.16667 4.75 5.16667C3.59917 5.16667 2.66667 4.23417 2.66667 3.08333ZM6.83333 9.33333C6.3725 9.33333 6 9.70583 6 10.1667V13.5H4.33333C3.41417 13.5 2.66667 12.7525 2.66667 11.8333V9.33333C2.66667 8.41417 3.41417 7.66667 4.33333 7.66667H12.6667C13.1275 7.66667 13.5 7.29417 13.5 6.83333C13.5 6.3725 13.1275 6 12.6667 6H4.33333C2.495 6 1 7.495 1 9.33333V11.8333C1 13.0617 1.675 14.125 2.66667 14.7033V20.1667C2.66667 20.6275 3.03917 21 3.5 21C3.96083 21 4.33333 20.6275 4.33333 20.1667V15.1667H6V20.1667C6 20.6275 6.3725 21 6.83333 21C7.29417 21 7.66667 20.6275 7.66667 20.1667V10.1667C7.66667 9.70583 7.29417 9.33333 6.83333 9.33333ZM17.25 1H9.33333C8.8725 1 8.5 1.3725 8.5 1.83333C8.5 2.29417 8.8725 2.66667 9.33333 2.66667H17.25C18.3992 2.66667 19.3333 3.60083 19.3333 4.75V9.75C19.3333 10.8992 18.3992 11.8333 17.25 11.8333H10.1667C9.70583 11.8333 9.33333 12.2058 9.33333 12.6667C9.33333 13.1275 9.70583 13.5 10.1667 13.5H17.25C19.3175 13.5 21 11.8175 21 9.75V4.75C21 2.6825 19.3175 1 17.25 1Z" fill="#6F756D" stroke="#FFF5F1" strokeWidth="0.4" />
                                                    </svg>
                                                    <span>{recordedCourse?.courseId?.instructor}</span>
                                                </div>
                                                <div className={styles.text}>
                                                    {/* <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18.4086 2.76643L18.4347 3.51598L18.4086 2.76643ZM15.1252 3.19699L14.9101 2.47849V2.47849L15.1252 3.19699ZM12.5345 4.40269L12.1588 3.75356L12.1588 3.75356L12.5345 4.40269ZM3.6507 2.81881L3.60469 3.5674L3.6507 2.81881ZM6.41683 3.19699L6.60819 2.47181L6.41683 3.19699ZM9.42556 4.46933L9.07497 5.13235L9.42556 4.46933ZM12.4921 18.397L12.8449 19.0588L12.4921 18.397ZM15.5835 17.0807L15.3921 16.3556L15.5835 17.0807ZM18.3199 16.7044L18.3667 17.4529L18.3199 16.7044ZM9.50821 18.397L9.15541 19.0588H9.15541L9.50821 18.397ZM6.41683 17.0807L6.60819 16.3556H6.60819L6.41683 17.0807ZM3.68045 16.7044L3.63363 17.4529L3.68045 16.7044ZM1.8335 14.7984H2.5835V4.58148H1.8335H1.0835V14.7984H1.8335ZM20.1668 14.7984H20.9168V4.52226H20.1668H19.4168V14.7984H20.1668ZM18.4086 2.76643L18.3825 2.01689C17.3383 2.05326 15.9675 2.16193 14.9101 2.47849L15.1252 3.19699L15.3403 3.91548C16.2022 3.65745 17.41 3.55167 18.4347 3.51598L18.4086 2.76643ZM15.1252 3.19699L14.9101 2.47849C13.9907 2.75374 12.9595 3.29016 12.1588 3.75356L12.5345 4.40269L12.9102 5.05181C13.6889 4.60117 14.5957 4.13839 15.3403 3.91548L15.1252 3.19699ZM3.6507 2.81881L3.60469 3.5674C4.48931 3.62177 5.48713 3.72733 6.22547 3.92216L6.41683 3.19699L6.60819 2.47181C5.72125 2.23776 4.6021 2.12587 3.69671 2.07022L3.6507 2.81881ZM6.41683 3.19699L6.22547 3.92216C7.10015 4.15298 8.18035 4.65929 9.07497 5.13235L9.42556 4.46933L9.77615 3.80632C8.86285 3.32339 7.65705 2.74858 6.60819 2.47181L6.41683 3.19699ZM12.4921 18.397L12.8449 19.0588C13.7526 18.5749 14.8724 18.0441 15.7749 17.8059L15.5835 17.0807L15.3921 16.3556C14.3119 16.6406 13.064 17.2422 12.1393 17.7351L12.4921 18.397ZM15.5835 17.0807L15.7749 17.8059C16.5048 17.6133 17.4887 17.5079 18.3667 17.4529L18.3199 16.7044L18.2731 15.9559C17.3738 16.0121 16.2695 16.124 15.3921 16.3556L15.5835 17.0807ZM9.50821 18.397L9.86101 17.7351C8.93635 17.2422 7.68841 16.6406 6.60819 16.3556L6.41683 17.0807L6.22547 17.8059C7.12791 18.0441 8.24769 18.5749 9.15541 19.0588L9.50821 18.397ZM6.41683 17.0807L6.60819 16.3556C5.73081 16.124 4.62657 16.0121 3.72727 15.9559L3.68045 16.7044L3.63363 17.4529C4.51161 17.5079 5.49555 17.6133 6.22547 17.8059L6.41683 17.0807ZM20.1668 14.7984H19.4168C19.4168 15.3916 18.924 15.9152 18.2731 15.9559L18.3199 16.7044L18.3667 17.4529C19.7485 17.3665 20.9168 16.2421 20.9168 14.7984H20.1668ZM20.1668 4.52226H20.9168C20.9168 3.14832 19.822 1.96674 18.3825 2.01689L18.4086 2.76643L18.4347 3.51598C18.9602 3.49767 19.4168 3.93004 19.4168 4.52226H20.1668ZM1.8335 14.7984H1.0835C1.0835 16.2421 2.25178 17.3665 3.63363 17.4529L3.68045 16.7044L3.72727 15.9559C3.0763 15.9152 2.5835 15.3916 2.5835 14.7984H1.8335ZM12.4921 18.397L12.1393 17.7351C11.4314 18.1125 10.5689 18.1125 9.86101 17.7351L9.50821 18.397L9.15541 19.0588C10.3043 19.6712 11.696 19.6712 12.8449 19.0588L12.4921 18.397ZM12.5345 4.40269L12.1588 3.75356C11.4273 4.17694 10.5166 4.19785 9.77615 3.80632L9.42556 4.46933L9.07497 5.13235C10.2788 5.76892 11.7382 5.7301 12.9102 5.05181L12.5345 4.40269ZM1.8335 4.58148H2.5835C2.5835 3.97581 3.06207 3.53405 3.60469 3.5674L3.6507 2.81881L3.69671 2.07022C2.22981 1.98007 1.0835 3.17384 1.0835 4.58148H1.8335Z" fill="#6F756D" />
                                                    <path d="M11 5.04199V18.792" stroke="#6F756D" stroke-width="1.5" />
                                                </svg>

                                                <span>8/12 Lessons</span> */}
                                                    <p>{recordedCourse?.courseId?.description}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </Link>
                            )))}
                    </div>
                );
        }
    };

    return (
        <div className={styles.coursesPagealignment}>
            <div className={styles.title}>
                <h2>My Courses</h2>
                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
            </div>
            {/* <div className={styles.tabAlignment}>
                {Object.values(TABS).map((tab) => (
                    <button
                        key={tab}
                        className={activeTab === tab ? styles.activeTab : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>

                    
                ))}
            </div> */}
            <div className={styles.algotabsmain}>
                <div className={styles.algotabs}>
                    {Object.values(TABS)?.map((tab, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`${styles.algotabs} ${activeTab === tab ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            <span>{tab}</span>
                        </button>
                    ))}
                </div>
            </div>
            {renderTabContent()}

            <Pagination
                currentPage={pagination.currentPage}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
