"use client";
import React, { useEffect, useState } from "react";
import styles from "./courseDetails.module.scss";
import ClockIcon from "@/icons/clockIcon";
import BathIcon from "@/icons/bathIcon";
import StarIcon from "@/icons/starIcon";
import ProfileGroupIcon from "@/icons/profileGroupIcon";
import { getChapters, getPaymentUrl } from "@/compoents/api/dashboard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import OutlineButton from "@/compoents/outlineButton";
import Button from "@/compoents/button";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/compoents/modal/Modal";


const LockIcon = '/assets/icons/lock.svg';
const RightBlackIcon = '/assets/icons/right-white.svg';
const SuccessIcon = '/assets/icons/success.svg';
const ErrorIcon = '/assets/icons/error.svg';

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

export default function CourseDetails({ params, selectedCourse, setSelectedCourse }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const id = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState({
    violations: 0,
    lastDetection: null,
    detectedTools: [],
    highConfidenceBlocks: 0,
    mediumConfidenceBlocks: 0,
  })


  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await getChapters(id);
      setChapters(data?.payload?.data || []);
      console.log(data?.payload?.data?.[0].courseId)
      setSelectedCourse(data?.payload?.data?.[0].courseId || null);
      setIsPaid(data?.payload.isPayment);

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

  useEffect(() => {
    const isPayment = searchParams.get('isPayment');
    if (isPayment) {
      setPaymentStatus(isPayment === 'true' ? 'success' : 'cancelled');
      setShowPaymentModal(true);
      // Clean up URL without refreshing the page
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('isPayment');
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   const monitorClipboard = async () => {
  //     try {
  //       if (navigator.clipboard && navigator.clipboard.read) {
  //         const clipboardItems = await navigator.clipboard.read()
  //         for (const item of clipboardItems) {
  //           if (item.types.includes("image/png") || item.types.includes("image/jpeg")) {
  //             setState((prev) => ({
  //               violations: prev.violations + 1,
  //               lastDetection: new Date(),
  //               detectedTools: [...prev.detectedTools.slice(-9), "Clipboard Screenshot"],
  //               highConfidenceBlocks: prev.highConfidenceBlocks + 1,
  //               mediumConfidenceBlocks: prev.mediumConfidenceBlocks,
  //             }))

  //             if (window.ultraFastBlock) {
  //               window.ultraFastBlock("Clipboard Screenshot", "Image detected in clipboard")
  //             }
  //             break
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       // Clipboard access denied - normal behavior
  //     }
  //   }

  //   // Check clipboard every 2 seconds
  //   const clipboardInterval = setInterval(monitorClipboard, 2000)

  //   return () => {
  //     clearInterval(clipboardInterval)
  //   }
  // }, [])


  //   document.addEventListener('visibilitychange', function() {
  //     if (document.hidden) {
  //         alert('Screen recording detected! Please stop recording.');
  //         var video = document.getElementById('myVideo');
  //         if (video) {
  //             video.pause();
  //         }
  //     }
  // });


  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      console.log("Payment handler called");
      const response = await getPaymentUrl({
        success_url: window.location.href,
        cancel_url: window.location.href,
        courseId: id
      });
      router.push(response?.payload?.data?.checkout_url);
    } catch (error) {
      console.error("Payment error:", error);
      // Handle error appropriately
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    const modalContent = paymentStatus === 'success' ? (
      <div className={styles.paymentModalContent}>
        <img src={SuccessIcon} alt="Success" className={styles.paymentIcon} />
        <h3>Payment Successful!</h3>
        <p>Thank you for your purchase. You now have full access to this course.</p>
        <Button
          text="Start Learning"
          onClick={() => {
            setShowPaymentModal(false);
            setIsPaid(false);
          }}
        />
      </div>
    ) : (
      <div className={styles.paymentModalContent}>
        <img src={ErrorIcon} alt="Cancelled" className={styles.paymentIcon} />
        <h3>Payment Cancelled</h3>
        <p>Your payment was not completed. Please try again to access the course.</p>
        <div className={styles.modalButtons}>
          <OutlineButton
            text="Try Again"
            onClick={() => {
              setShowPaymentModal(false);
              handlePayment();
            }}
          />
          <Button
            text="Close"
            onClick={() => setShowPaymentModal(false)}
            style={{ marginLeft: '10px' }}
          />
        </div>
      </div>
    );

    return (
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        {modalContent}
      </Modal>
    );
  };

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
            <img
              src="/assets/icons/no-course.svg"
              alt="No courses"
              className={styles.emptyImage}
            />
            <h3>No Course Content Available</h3>
            <p>This course doesn't have any chapters yet. Please check back later.</p>
          </div>
        </div>
      </div>
    );
  }

  const course = chapters[0]?.courseId || {};
  console.log(isPaid)
  console.log(selectedChapter)
  return (
    <div className={styles.courseDetailsBox}>
      {renderPaymentModal()}
      <div className={styles.textStyle}>
        <h3>{course.CourseName || 'Course Name Not Available'}</h3>
        <p>{course.description || 'No description available'}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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
          {!isPaid && <div>
            <Button
              text={isProcessingPayment ? 'Enrolling...' : 'Enroll Now'}
              icon={isProcessingPayment ? null : RightBlackIcon}
              onClick={handlePayment}
              disabled={isProcessingPayment}
            />
          </div>}
        </div>
        <div className={styles.mainrelative}>
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
            <div className={`${styles.mainGrid} ${!isPaid ? styles.locked : ''}`}>
              <div className={styles.items}>
                <div className={styles.image}>
                  {selectedChapter.chapterVideo ? (
                    !isPaid ? (
                      <div className={styles.videoLocked}>
                        <div className={styles.lockOverlay}>
                          <img src={LockIcon} alt="Locked" />
                          <p>Enroll to unlock this video</p>
                        </div>
                        <img
                          src={`https://img.youtube.com/vi/${selectedChapter.chapterVideo.split('v=')[1]}/hqdefault.jpg`}
                          alt="Video thumbnail"
                          className={styles.videoThumbnail}
                        />
                      </div>
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedChapter.chapterVideo}
                        title={selectedChapter.chapterName}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  ) : (
                    <div className={styles.noVideo}>Video not available</div>
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
          {!isPaid && <div className={styles.locksystem}>
            <div>
              <div className={styles.iconCenter}>
                <img src={LockIcon} alt="LockIcon" />
              </div>
              <span>Enroll Now to unlock</span>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
