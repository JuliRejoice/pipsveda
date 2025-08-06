"use client";
import React, { useEffect, useState } from "react";
import styles from "./courseDetails.module.scss";
import ClockIcon from "@/icons/clockIcon";
import BathIcon from "@/icons/bathIcon";
import StarIcon from "@/icons/starIcon";
import ProfileGroupIcon from "@/icons/profileGroupIcon";
import { getChapters } from "@/compoents/api/dashboard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton Loader Component
const CourseDetailsSkeleton = () => (
  <div className={styles.courseDetailsBox}>
    <div className={styles.textStyle}>
      <Skeleton height={20} width="60%" style={{ marginBottom: '10px' }} />
      <Skeleton count={1} style={{ marginBottom: '8px' }} />
      
      <div className={styles.allIconTextAlignment}>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className={styles.iconText}>
            <Skeleton circle width={20} height={20} />
            <Skeleton width={100} height={20} style={{ marginLeft: '6px' }} />
          </div>
        ))}
      </div>

      <div className={styles.tabAlignment}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton 
            key={item} 
            width={120} 
            height={50} 
            style={{ marginRight: '15px' }} 
          />
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.items}>
          <Skeleton 
            height={400} 
            style={{ 
              borderRadius: '20px',
              backgroundColor: 'rgba(1, 11, 29, 0.20)'
            }} 
          />
        </div>
        <div className={styles.items}>
          <Skeleton 
            height={32} 
            width="80%" 
            style={{ marginBottom: '15px' }} 
          />
          <Skeleton count={5} style={{ marginBottom: '15px' }} />
        </div>
      </div>
    </div>
  </div>
);

export default function CourseDetails({ params }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState(null);
  const id = params;

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await getChapters(id);
      setChapters(data?.payload?.data || []);
      
      // Set the first chapter as selected by default if available
      if (data?.payload?.data?.length > 0) {
        setSelectedChapter(data.payload.data[0]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching chapters:", err);
      setError("Failed to load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchChapters();
  }, [id]);


  if (loading) {
    return <CourseDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.courseDetailsBox}>
        <div className={styles.textStyle}>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#E53E3E'
          }}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--button-gradient)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                marginTop: '16px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className={styles.courseDetailsBox}>
        <div className={styles.textStyle}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h3>No Course Content Available</h3>
            <p>This course doesn't have any chapters yet. Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  const course = chapters[0]?.courseId || {};

  return (
    <div className={styles.courseDetailsBox}>
      <div className={styles.textStyle}>
        <h3>{course.CourseName || 'Course Name Not Available'}</h3>
        <p>{course.description || 'No description available'}</p>
        <div className={styles.allIconTextAlignment}>
          <div className={styles.iconText}>
            <ClockIcon />
            <span>12 hours</span>
          </div>
          <div className={styles.iconText}>
            <BathIcon />
            <span>{course.instructor || 'Instructor'}</span>
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
            <span>Last-Update: {new Date(course.updatedAt || new Date()).toLocaleDateString('en-GB')} | English</span>
          </div>
        </div>
        <div className={styles.tabAlignment}>
          {chapters.map((chapter, index) => (
            <button
              key={chapter._id}
              className={selectedChapter?._id === chapter._id ? styles.activeTab : ''}
              onClick={() => setSelectedChapter(chapter)}
            >
              Chapter {chapter.chapterNo || index + 1}
            </button>
          ))}
        </div>
        {selectedChapter && (
          <div className={styles.mainGrid}>
            <div className={styles.items}>
              <div className={styles.image}>
                {selectedChapter.chapterVideo ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedChapter.chapterVideo.split('v=')[1]}`}
                    title={selectedChapter.chapterName}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className={styles.placeholderImage}></div>
                )}
              </div>
            </div>
            <div className={styles.items}>
              <div className={styles.details}>
                <h4>Chapter {selectedChapter.chapterNo} : {selectedChapter.chapterName || 'Untitled Chapter'}</h4>
                <p>{selectedChapter.description || 'No description available for this chapter.'} 
                  {!selectedChapter.description && (
                    <>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hendrerit, 
                      nulla non ultricies finibus, nibh purus ullamcorper augue, non tempor arcu 
                      nulla vitae nulla. Curabitur feugiat, ligula nec aliquam tincidunt, nulla 
                      ligula pretium eros, sed posuere neque lacus at neque.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
