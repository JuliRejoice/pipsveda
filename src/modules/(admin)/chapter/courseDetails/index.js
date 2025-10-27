"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./courseDetails.module.scss";
import ClockIcon from "@/icons/clockIcon";
import BathIcon from "@/icons/bathIcon";
import StarIcon from "@/icons/starIcon";
import ProfileGroupIcon from "@/icons/profileGroupIcon";
import { getBatches, getChapters, getCourses, getPaymentUrl, getSessionData } from "@/compoents/api/dashboard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import OutlineButton from "@/compoents/outlineButton";
import Button from "@/compoents/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "@/compoents/modal/Modal";
import toast from "react-hot-toast";
import Arrowicon from "@/icons/arrowicon";
import Slider from "react-slick/lib/slider";
import { getCookie } from "../../../../../cookie";
import CustomVideoPlayer from "@/compoents/CustomVideoPlayer";
import BatchSelectionModal from "@/compoents/modal/BatchSelectionModal";


const LockIcon = '/assets/icons/lock.svg';
const RightBlackIcon = '/assets/icons/right-white.svg';
const SuccessIcon = '/assets/icons/success.svg';
const ErrorIcon = '/assets/icons/error.svg';
const EmailIcon = '/assets/icons/email-icon.svg';
const CallIcon = '/assets/icons/call.svg';
const LocationIcon = '/assets/icons/location.svg';

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className={`${styles.arrow} ${styles.rightIcon}`}
      onClick={onClick}
    >
      <Arrowicon />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className={`${styles.arrow} ${styles.leftIcon}`}
      onClick={onClick}
    >
      <Arrowicon />
    </div>
  );
}

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

const SessionSkeleton = () => (
  <div className={styles.sessionSkeleton}>
    <div className={styles.skeletonVideo}>
      <Skeleton height={200} style={{ display: 'block' }} />
    </div>
    <div className={styles.skeletonContent}>
      <Skeleton height={24} width="70%" style={{ marginBottom: '12px' }} />
      <Skeleton count={2} style={{ marginBottom: '8px' }} />
      <Skeleton width="80%" style={{ marginBottom: '16px' }} />
      <div className={styles.skeletonMeta}>
        <Skeleton width="40%" style={{ marginRight: '30px' }} />
        <Skeleton width="30%" />
      </div>
      <Skeleton height={40} style={{ marginTop: '16px', borderRadius: '6px' }} />
    </div>
  </div>
);

export default function CourseDetails({ params, selectedCourse, setSelectedCourse }) {
  const [user, setUser] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLiveOnline, setIsLiveOnline] = useState(false);
  const [isInPerson, setIsInPerson] = useState(false);
  const [isBeforepaymentModal, setIsBeforepaymentModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const id = params;
  const router = useRouter();
  const searchParams = useSearchParams();


  console.log("user", user);

  useEffect(() => {
    if (selectedCourse) {
      setIsLiveOnline(selectedCourse?.courseType === 'live');
      setIsInPerson(selectedCourse?.courseType === 'physical');
    }
  }, [selectedCourse])

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await getCourses({ id: params });
      setSelectedCourse(res?.payload?.data?.[0] || {});
      const data = await getChapters(id);
      setChapters(data?.payload?.data || []);
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

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await getCourses({ id: params });
      setSelectedCourse(res?.payload?.data?.[0] || {});
      const data = await getSessionData(id);
      setSessions(data?.payload?.data || []);
      setIsPaid(data?.payload.isPayment);
      setError(null);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (isLiveOnline) {
      fetchSessions();
    } else {
      fetchChapters();
    }
  }, [id, isLiveOnline]);


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

  useEffect(() => {
    const user = JSON.parse(getCookie("user"));
    setUser(user);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    centerMode: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          centerMode: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false
        }
      },
    ]
  };

  // Add this function to check if a session is expired
  const isSessionExpired = (session) => {
    if (!session?.date || !session?.time) return true;

    const sessionDateTime = new Date(`${session.date}`);
    const currentDateTime = new Date();


    return sessionDateTime < currentDateTime;
  };

  // Filter out expired sessions
  const upcomingSessions = sessions.filter(session => !isSessionExpired(session));

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      const response = await getPaymentUrl({
        success_url: window.location.href,
        cancel_url: window.location.href,
        courseId: id
      });
      if (response?.payload?.code !== "00000") {
        toast.error("A payment session is already active and will expire in 10 minutes. Please complete the current payment or try again after it expires.");
      } else {
        router.replace(response?.payload?.data?.checkout_url);
      }

    } catch (error) {
      console.error("Payment error:", error);
      // Handle error appropriately
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchbatches = async (courseId) => {
    try {
      setIsBeforepaymentModal(true)
      setIsLoading(true);
      const response = await getBatches({ courseId });
      console.log(response)
        setBatches(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches");
    } finally {
      setIsLoading(false);
      // setIsBeforepaymentModal(false)
    }
  };

  const handleBatchSelect = async (batch) => {
    console.log("batch", batch)
     try {
      setIsProcessingPayment(true);
      const response = await getPaymentUrl({
        success_url: window.location.href,
        cancel_url: window.location.href,
        courseId: id,
        batchId: batch
      });
      if (response?.payload?.code !== "00000") {
        toast.error("A payment session is already active and will expire in 10 minutes. Please complete the current payment or try again after it expires.");
      } else {
        router.replace(response?.payload?.data?.checkout_url);
      }

    } catch (error) {
      console.error("Payment error:", error);
      // Handle error appropriately
    } finally {
      setIsProcessingPayment(false);
    }
  }

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    const modalContent = paymentStatus === 'success' ? (
      <div className={styles.paymentModalContent}>
        <div className={styles.paymentModaltitlecontent}>
          <img src={SuccessIcon} alt="Success" className={styles.paymentIcon} />
          {isInPerson && <h3>Congratulations!</h3>}
          <h3>Payment Successful!</h3>
          <p>Thank you for your purchase. You now have full access to this course.</p>
        </div>
        {isInPerson &&
          <div className={styles.paymentmodaldetails}>
            <p>Please Contact for extra Information.</p>
            <p><span>Address</span> : {selectedCourse?.location && `${selectedCourse?.location}`}</p>
            <p><span>Email</span> : {selectedCourse?.email && `${selectedCourse?.email}`}</p>
            <p><span>Phone</span> : {selectedCourse?.phone && `${selectedCourse?.phone}`}</p>
          </div>
        }
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
    return isLiveOnline ? (
      <div className={styles.sessionContainer}>
        <h2>Upcoming Sessions</h2>
        <div className={styles.sessionListmain}>
          <div className={styles.sessionList}>
            {[1, 2, 3].map((item) => (
              <SessionSkeleton key={item} />
            ))}
          </div>
        </div>
      </div>
    ) : <CourseDetailsSkeleton />;
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

  return (
    <div className={styles.courseDetailsBox}>
      {renderPaymentModal()}
      {isLiveOnline ? (
        <div className={styles.sessionContainer}>
          <div className={styles.textStyle}>
            <h3>{selectedCourse?.CourseName || 'Course Name Not Available'}</h3>
            <p>{selectedCourse?.description || 'No description available'}</p>
            <div className={styles.alignments}>
              <div className={styles.allIconTextAlignment}>
                <div className={styles.iconText}>
                  <ClockIcon />
                  <span>{selectedCourse?.hours || '12'} hours</span>
                </div>
                <div className={styles.iconText}>
                  <BathIcon />
                  <span>{selectedCourse?.instructor?.name || 'Instructor'}</span>
                </div>
                {/* <div className={styles.iconText}>
                  <StarIcon />
                  <span>4.8</span>
                </div> */}
                <div className={styles.iconText}>
                  <ProfileGroupIcon />
                  <span>{selectedCourse?.subscribed || '0'}</span>
                </div>
                <div className={styles.iconText}>
                  <span>Last-Update: {new Date(selectedCourse?.updatedAt || new Date()).toLocaleDateString('en-GB')} | English</span>
                </div>
              </div>
              {!isPaid && <div>
                <Button
                  fill
                  text={isProcessingPayment ? 'Enrolling...' : 'Enroll Now'}
                  icon={isProcessingPayment ? null : RightBlackIcon}
                  // onClick={handlePayment}
                  onClick={()=>fetchbatches(selectedCourse._id)}
                  disabled={isProcessingPayment}
                />
              </div>}
            </div>
          </div>
          <h2>Upcoming Sessions</h2>
          <div className={`${styles.sessionListmain} ${!isPaid ? styles.lockedSession : ''}`}>
            <div className={styles.sessionListslider}>
              {(upcomingSessions.length > 0 && !loading) ? (
                <Slider {...settings}>
                  {upcomingSessions.map((session) => (
                    <div key={session._id}>
                      <div className={styles.sessionCard}>
                        <div className={styles.sessionVideo}>
                          <img
                            src={session.sessionVideo}
                            alt={session.sessionName}
                            className={styles.videoThumbnail}
                          />
                        </div>
                        <div className={styles.sessionDetails}>
                          <h3>{session.sessionName}</h3>
                          <p>{session.description}</p>
                          <div className={styles.sessionMeta}>
                            <div style={{ display: 'flex', gap: '30px' }}>
                              <span><strong>Date:</strong> {new Date(session.date).toLocaleDateString('en-GB')}</span>
                              <span><strong>Time:</strong> {session.time}</span>
                            </div>
                            <span><strong>Instructor:</strong> {session.courseId?.instructor?.name}</span>
                          </div>
                          {session.meetingLink && (
                            <Button
                              onClick={() => isPaid && window.open(session.meetingLink, '_blank')}
                              text="Join Meeting"
                              disabled={!isPaid}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className={styles.noSessions}>
                  <p>No upcoming sessions available. Please check back later for new schedules.</p>
                </div>
              )}
            </div>
            {!isPaid && (
              <div className={styles.sessionLockOverlay}>
                <div className={styles.lockContent}>
                  <img src={LockIcon} alt="Locked" className={styles.lockIcon} />
                  <p>Enroll to unlock this session</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.textStyle}>
          <h3>{selectedCourse?.CourseName || 'Course Name Not Available'}</h3>
          <p>{selectedCourse?.description || 'No description available'}</p>
          {!isPaid && <div className={styles.price}>
              <h4 className={styles.priceText}>${selectedCourse.price}</h4>
            </div>}
          <div className={styles.alignments}>
            <div>
              <div className={styles.allIconTextAlignment}>
                <div className={styles.iconText}>
                  <ClockIcon />
                  <span>{selectedCourse?.hours || '12'} hours</span>
                </div>
                <div className={styles.iconText}>
                  <BathIcon />
                  <span>{selectedCourse?.instructor?.name || 'Instructor'}</span>
                </div>
                {/* <div className={styles.iconText}>
                <StarIcon />
                <span>4.8</span>
              </div> */}
                <div className={styles.iconText}>
                  <ProfileGroupIcon />
                  <span>{selectedCourse?.subscribed || '0'}</span>
                </div>
                <div className={styles.iconText}>
                  <span>Last-Update: {new Date(selectedCourse?.updatedAt || new Date()).toLocaleDateString('en-GB')} | English</span>
                </div>
              </div>
            </div>
           
            {!isPaid && <div>
              <Button
                text={isProcessingPayment ? 'Enrolling...' : 'Enroll Now'}
                icon={isProcessingPayment ? null : RightBlackIcon}
                // onClick={handlePayment}
                onClick={() => fetchbatches(selectedCourse._id)}
                disabled={isProcessingPayment}
              />
            </div>}
          </div>
          {isPaid && selectedCourse.courseType === "physical" && <div>
            <div className={styles.physicaldetailsmain}>
              {selectedCourse?.location && <div className={styles.physicaldetail}><img src={LocationIcon} alt='ChatIcon' /><p>{selectedCourse?.location}</p></div>}
              {selectedCourse?.email && <div className={styles.physicaldetail}><img src={EmailIcon} alt='ChatIcon' /><p>{selectedCourse?.email}</p></div>}
              {selectedCourse?.phone && <div className={styles.physicaldetail}><img src={CallIcon} alt='ChatIcon' /><p>{selectedCourse?.phone}</p></div>}
            </div>
          </div>}
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
            {selectedChapter && chapters.length > 0 ? (
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
                        <div className={styles.videoWrapper}>
                          {/* <VideoPlayer
                            src={selectedChapter.chapterVideo}
                            userId={user?._id}
                            controls
                            controlsList="nodownload"
                            disablePictureInPicture
                            noremoteplayback
                            className={styles.videoPlayer}
                          /> */}
                          {console.log("selectedChapter.chapterVideo", selectedChapter.chapterVideo)}

                          <CustomVideoPlayer
                            src={selectedChapter.chapterVideo}
                            // src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            // src="https://pipsveda.s3.us-east-1.azonaws.com/pipsveda/blob-1757418874956new%20latest.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAVJSBBJ5XMZUEA2XW%2F20250913%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250913T063038Z&X-Amz-Expires=3600&X-Amz-Signature=e0ed6c6d43a4038201fd1206007456c1387457b7cb86fb7335d92417d65ba51b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
                            userId={user?._id}
                            controls
                            controlsList="nodownload"
                            disablePictureInPicture
                            noremoteplayback
                            className={styles.videoPlayer}
                          />
                        </div>
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
              </div>) : (
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
      )}

      <BatchSelectionModal
        isOpen={isBeforepaymentModal}
        onClose={() => setIsBeforepaymentModal(false)}
        batches={batches}
        onBatchSelect={handleBatchSelect}
        courseTitle={selectedCourse?.CourseName || 'Course'}
      />
    </div>
  );
}