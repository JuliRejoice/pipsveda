"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./courseDetails.module.scss";
import ClockIcon from "@/icons/clockIcon";
import BathIcon from "@/icons/bathIcon";
import StarIcon from "@/icons/starIcon";
import ProfileGroupIcon from "@/icons/profileGroupIcon";
import { getChapters, getCourses, getPaymentUrl, getSessionData, getBatches, getCourseSyllabus, updateVideoProgress, downloadCourseCertificate, downloadStudentID } from "@/compoents/api/dashboard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OutlineButton from "@/compoents/outlineButton";
import Button from "@/compoents/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "@/compoents/modal/Modal";
import toast from "react-hot-toast";
import Arrowicon from "@/icons/arrowicon";
import Slider from "react-slick/lib/slider";
import { getCookie } from "../../../../../cookie";
import CustomVideoPlayer from "@/compoents/CustomVideoPlayer";
import ReviewSystem from "@/compoents/reviewSystem";
import { getOneBatch } from "@/compoents/api/dashboard";

const LockIcon = "/assets/icons/lock.svg";
const RightBlackIcon = "/assets/icons/right-white.svg";
const SuccessIcon = "/assets/icons/success.svg";
const ErrorIcon = "/assets/icons/error.svg";
const EmailIcon = "/assets/icons/email-icon.svg";
const CallIcon = "/assets/icons/call.svg";
const LocationIcon = "/assets/icons/location.svg";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div className={`${styles.arrow} ${styles.rightIcon}`} onClick={onClick}>
      <Arrowicon />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div className={`${styles.arrow} ${styles.leftIcon}`} onClick={onClick}>
      <Arrowicon />
    </div>
  );
}

const CourseDetailsSkeleton = () => (
  <div className={styles.courseDetailsBox}>
    <div className={styles.textStyle}>
      <Skeleton height={20} width="60%" style={{ marginBottom: "10px" }} />
      <Skeleton count={1} style={{ marginBottom: "8px" }} />

      <div className={styles.allIconTextAlignment}>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className={styles.iconText}>
            <Skeleton circle width={20} height={20} />
            <Skeleton width={100} height={20} style={{ marginLeft: "6px" }} />
          </div>
        ))}
      </div>

      <div className={styles.tabAlignment}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} width={120} height={50} style={{ marginRight: "15px" }} />
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.items}>
          <Skeleton
            height={400}
            style={{
              borderRadius: "20px",
              backgroundColor: "rgba(1, 11, 29, 0.20)",
            }}
          />
        </div>
        <div className={styles.items}>
          <Skeleton height={32} width="80%" style={{ marginBottom: "15px" }} />
          <Skeleton count={5} style={{ marginBottom: "15px" }} />
        </div>
      </div>
    </div>
  </div>
);

const SessionSkeleton = () => (
  <div className={styles.sessionSkeleton}>
    <div className={styles.skeletonVideo}>
      <Skeleton height={200} style={{ display: "block" }} />
    </div>
    <div className={styles.skeletonContent}>
      <Skeleton height={24} width="70%" style={{ marginBottom: "12px" }} />
      <Skeleton count={2} style={{ marginBottom: "8px" }} />
      <Skeleton width="80%" style={{ marginBottom: "16px" }} />
      <div className={styles.skeletonMeta}>
        <Skeleton width="40%" style={{ marginRight: "30px" }} />
        <Skeleton width="30%" />
      </div>
      <Skeleton height={40} style={{ marginTop: "16px", borderRadius: "6px" }} />
    </div>
  </div>
);

export default function CourseDetails({ params }) {
  const [user, setUser] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
  const [isDownloadingStudentId, setIsDownloadingStudentId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLiveOnline, setIsLiveOnline] = useState(false);
  const [isInPerson, setIsInPerson] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCertificateAvailable, setIsCertificateAvailable] = useState(false);
  const [batchDetails, setBatchDetails] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [expandedSyllabus, setExpandedSyllabus] = useState(null);
  const [videoWatchingPercentage, setVideoWatchingPercentage] = useState(0);

  const id = params;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (selectedCourse) {
      setIsLiveOnline(selectedCourse?.courseType === "live");
      setIsInPerson(selectedCourse?.courseType === "physical");

      // Check if certificate is available (course has ended and user has paid)
      if (selectedCourse.courseEnd && selectedCourse.isPayment) {
        const courseEndDate = new Date(selectedCourse.courseEnd);
        const today = new Date();
        setIsCertificateAvailable(courseEndDate < today);
      }
    }
  }, [selectedCourse]);

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
        if (res?.payload?.data?.[0]?.courseType === "recorded") {
          setVideoWatchingPercentage(data.payload.data[0]?.courseTracking?.percentage);
        }
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

  const fetchBatchDetails = async (batchId) => {
    try {
      setIsLoadingBatch(true);
      // Use getOneBatch to fetch a specific batch by ID
      const response = await getOneBatch(batchId);
      // The API returns the batch data directly in the response
      setBatchDetails(response.payload?.data[0] || null);
    } catch (error) {
      console.error("Error fetching batch details:", error);
      setBatchDetails(null);
    } finally {
      setIsLoadingBatch(false);
    }
  };

  const fetchSyllabusData = async (courseId) => {
    try {
      // The getCourseSyllabus function is already using the correct endpoint
      const response = await getCourseSyllabus(courseId);
      // The API returns the syllabus data in the payload.data array
      setSyllabus(response.payload?.data || []);
    } catch (error) {
      console.error("Error fetching syllabus:", error);
      setSyllabus([]);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (isLiveOnline || isInPerson) {
      // For live/online courses, fetch batch details and syllabus
      const userBatchId = selectedCourse?.payment?.[0]?.batchId;
      if (userBatchId) {
        fetchBatchDetails(userBatchId);
      }
      fetchSyllabusData(id);
      fetchSessions();
    } else {
      // For self-paced courses
      fetchChapters();
    }
  }, [id, isLiveOnline, isInPerson, selectedCourse?.payment?.[0]?.batchId]);

  // Ensure first chapter is selected when chapters change
  useEffect(() => {
    if (chapters.length > 0 && !selectedChapter) {
      setSelectedChapter(chapters[0]);
    }
  }, [chapters, selectedChapter]);

  useEffect(() => {
    const isPayment = searchParams.get("isPayment");
    if (isPayment) {
      setPaymentStatus(isPayment === "true" ? "success" : "cancelled");
      setShowPaymentModal(true);
      // Clean up URL without refreshing the page
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("isPayment");
      window.history.replaceState({}, "", newUrl);
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
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  // Add this function to check if a session is expired
  const isSessionExpired = (session) => {
    if (!session?.date || !session?.time) return true;

    const sessionDateTime = new Date(`${session.date}`);
    const currentDateTime = new Date();

    return sessionDateTime < currentDateTime;
  };

  // Filter out expired sessions
  const upcomingSessions = sessions.filter((session) => !isSessionExpired(session));

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      const response = await getPaymentUrl({
        success_url: window.location.href,
        cancel_url: window.location.href,
        courseId: id,
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

  const updateVideoPercentage = async (percentage) => {
    const numericPercentage = typeof percentage === "number" ? percentage : parseFloat(percentage);

    if (!Number.isFinite(numericPercentage)) {
      return;
    }

    const currentStatePercentage = Number.isFinite(Number(videoWatchingPercentage)) ? Number(videoWatchingPercentage) : 0;
    const currentChapterPercentage = Number.isFinite(Number(selectedChapter?.courseTracking?.percentage)) ? Number(selectedChapter?.courseTracking?.percentage) : 0;

    const maxPercentage = Math.max(currentStatePercentage, currentChapterPercentage, numericPercentage);

    const normalizedPercentage = Number(maxPercentage.toFixed(2));

    setVideoWatchingPercentage(normalizedPercentage);

    setSelectedChapter((prev) => {
      if (!prev) return prev;

      const prevPercentage = Number.isFinite(Number(prev.courseTracking?.percentage)) ? Number(prev.courseTracking?.percentage) : 0;

      if (normalizedPercentage <= prevPercentage) {
        return prev;
      }

      return {
        ...prev,
        courseTracking: {
          ...prev.courseTracking,
          percentage: normalizedPercentage,
        },
      };
    });

    if (!selectedChapter?.courseTracking?._id || !selectedChapter?._id || !selectedCourse?._id) {
      return;
    }

    if (normalizedPercentage <= currentChapterPercentage) {
      return;
    }

    try {
      await updateVideoProgress(selectedChapter.courseTracking._id, selectedChapter._id, selectedCourse._id, normalizedPercentage.toString());
    } catch (error) {
      console.error("Error updating video progress:", error);
    }
  };

  const downloadId = async (id) => {
    setIsDownloadingStudentId(true);
    try {
      const response = await downloadStudentID(id, batchDetails?._id);
      if (response.success && response.payload) {
        const fileUrl = response.payload;

        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) throw new Error("File fetch failed");

        const blob = await fileRes.blob();

        const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

        const extensionMap = {
          "application/pdf": "pdf",
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "text/html": "html",
          "application/json": "json",
        };

        const extension = extensionMap[contentType] || "bin";

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `student-${Date.now()}.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        toast.success("File downloaded successfully!");
        setShowPaymentModal(false);
      } else {
        throw new Error("Failed to generate file URL");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setIsDownloadingStudentId(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (isDownloadingCertificate) return;

    setIsDownloadingCertificate(true);
    try {
      if (!selectedCourse?._id) {
        throw new Error("No course selected");
      }

      const response = await downloadCourseCertificate(selectedCourse?._id);

      if (!response) {
        throw new Error("No response received from the server");
      }

      const fileUrl = typeof response === "object" ? response.payload : response;

      if (!fileUrl) {
        throw new Error("Certificate URL is missing in the response");
      }

      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) throw new Error("Failed to fetch certificate");

      const blob = await fileRes.blob();

      const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

      const extensionMap = {
        "application/pdf": "pdf",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "text/html": "html",
        "application/json": "json",
      };

      const extension = extensionMap[contentType] || "bin";
      const fileName = `certificate-${selectedCourse.CourseName?.replace(/\s+/g, "-").toLowerCase() || "course"}.${extension}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download certificate");
    } finally {
      setIsDownloadingCertificate(false);
    }
  };

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    const modalContent =
      paymentStatus === "success" ? (
        <div className={styles.paymentModalContent}>
          <div className={styles.paymentModaltitlecontent}>
            <img src={SuccessIcon} alt="Success" className={styles.paymentIcon} />
            {isInPerson && <h3>Congratulations!</h3>}
            <h3>Payment Successful!</h3>
            <p>Thank you for your purchase. You now have full access to this course.</p>
          </div>
          {isInPerson && (
            <div className={styles.paymentmodaldetails}>
              <p>Please Contact for extra Information.</p>
              <p>
                <span>Address</span> : {selectedCourse?.location && `${selectedCourse?.location}`}
              </p>
              <p>
                <span>Email</span> : {selectedCourse?.email && `${selectedCourse?.email}`}
              </p>
              <p>
                <span>Phone</span> : {selectedCourse?.phone && `${selectedCourse?.phone}`}
              </p>
            </div>
          )}
          <Button text="Download Student ID" onClick={() => downloadId(selectedCourse?._id)} />
        </div>
      ) : (
        // <div className={styles.paymentModalContent}>
        //   <div className={styles.paymentModaltitlecontent}>
        //     <img src={ErrorIcon} alt="Cancelled" className={styles.paymentIcon} />
        //     <h3>Payment Cancelled</h3>
        //     <p>Your payment was not completed. Please try again to access the course.</p>
        //   </div>
        //   <div className={styles.modalButtons}>
        //     <OutlineButton
        //       text="Try Again"
        //       onClick={() => {
        //         setShowPaymentModal(false);
        //         handlePayment();
        //       }}
        //     />
        //     <Button
        //       text="Close"
        //       onClick={() => setShowPaymentModal(false)}
        //       style={{ marginLeft: '10px' }}
        //     />
        //   </div>
        // </div>
        <div className={styles.paymentModalContent}>
          <div className={styles.paymentModaltitlecontent}>
            <img src={ErrorIcon} alt="Cancelled" className={styles.paymentIcon} />
            <h3>Payment Cancelled</h3>
            <p>Your payment was not completed. Please try again to access the course.</p>
          </div>
          <div className={styles.modalButtons}>
            <OutlineButton
              text="Try Again"
              onClick={() => {
                setShowPaymentModal(false);
                handlePayment();
              }}
            />
            <Button text="Close" onClick={() => setShowPaymentModal(false)} style={{ marginLeft: "10px" }} />
          </div>
        </div>
      );

    return (
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        {modalContent}
      </Modal>
    );
  };

  const formatPurchasedDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    ) : (
      <CourseDetailsSkeleton />
    );
  }

  if (error) {
    return (
      <div className={styles.courseDetailsBox}>
        <div className={styles.textStyle}>
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#E53E3E",
            }}
          >
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "var(--button-gradient)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                marginTop: "16px",
                cursor: "pointer",
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
      {isLiveOnline || isInPerson ? (
        <div className={styles.sessionContainer}>
          <div className={styles.textStyle}>
            <div className={styles.title}>
              <h3>{selectedCourse?.CourseName || "Course Name Not Available"}</h3>

              {/* <div className={styles.infoRow} style={{ margin: '10px 0' }}>
                <span style={{ fontWeight: 'bold' }}>Purchased On: </span>
                <span>{formatPurchasedDate(coursePurchasedDate)}</span>
              </div> */}
            </div>
            <p>{selectedCourse?.description || "No description available"}</p>
            <div className={styles.alignments}>
              <div className={styles.allIconTextAlignment}>
                <div className={styles.iconText}>
                  <ClockIcon />
                  <span>{selectedCourse?.hours || "12"} hours</span>
                </div>
                <div className={styles.iconText}>
                  <BathIcon />
                  <span>{selectedCourse?.instructor?.name || "Instructor"}</span>
                </div>
                <div className={styles.iconText}>
                  <ProfileGroupIcon />
                  <span>{selectedCourse?.subscribed || "0"}</span>
                </div>
                <div className={styles.iconText}>
                  <span>
                    Last-Update: {new Date(selectedCourse?.updatedAt || new Date()).toLocaleDateString("en-GB")} | {selectedCourse?.language?.slice(0, 1).toUpperCase() + selectedCourse?.language?.slice(1) || "English"}
                  </span>
                </div>
                {selectedCourse?.courseEnd && (
                  <div className={styles.iconText}>
                    <span>Course Ends: {new Date(selectedCourse.courseEnd).toLocaleDateString("en-GB")}</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {isPaid && selectedCourse?.courseType === "physical" ? (
                  <>
                    <Button
                      fill
                      text={isDownloadingStudentId ? "Downloading..." : "Download Student ID"}
                      onClick={() => downloadId(selectedCourse?._id)}
                      style={{
                        background: !isDownloadingStudentId ? "#10B981" : "#9CA3AF",
                        marginBottom: isCertificateAvailable ? "10px" : 0,
                      }}
                      disabled={isDownloadingStudentId || isDownloadingCertificate}
                      icon={isDownloadingStudentId ? null : undefined}
                    />
                    {isCertificateAvailable && (
                      <Button
                        fill
                        text={isDownloadingCertificate ? "Downloading..." : "Download Certificate"}
                        onClick={handleDownloadCertificate}
                        style={{
                          background: !isDownloadingCertificate ? "#10B981" : "#9CA3AF",
                        }}
                        disabled={isDownloadingCertificate || isDownloadingStudentId}
                        icon={isDownloadingCertificate ? null : undefined}
                      />
                    )}
                  </>
                ) : (
                  isPaid && (
                    <Button
                      fill
                      text={isDownloadingCertificate ? "Downloading..." : "Download Certificate"}
                      onClick={handleDownloadCertificate}
                      style={{
                        background: isCertificateAvailable && !isDownloadingCertificate ? "#10B981" : "#9CA3AF",
                      }}
                      disabled={!isCertificateAvailable || isDownloadingCertificate}
                      icon={isDownloadingCertificate ? null : undefined}
                    />
                  )
                )}
                {!isPaid && <Button fill text={isProcessingPayment ? "Enrolling..." : "Enroll Now"} icon={isProcessingPayment ? null : RightBlackIcon} onClick={handlePayment} disabled={isProcessingPayment} />}
              </div>
            </div>
          </div>
          {isLiveOnline || isInPerson ? (
            <>
              {/* Batch Details Section */}
              <h3 className={styles.sectionTitle}>Batch Details</h3>
              <div className={styles.batchDetails}>
                {isLoadingBatch ? (
                  <div className={styles.skeletonLoader}>
                    <Skeleton height={100} />
                  </div>
                ) : batchDetails ? (
                  <div className={styles.batchInfo}>
                    <div className={styles.batchMeta}>
                      <div className={styles.metaItem}>
                        <strong>Start Date:</strong> {new Date(batchDetails.startDate).toLocaleDateString()}
                      </div>
                      <div className={styles.metaItem}>
                        <strong>End Date:</strong> {new Date(batchDetails.endDate).toLocaleDateString()}
                      </div>
                      {batchDetails.meetingLink && (
                        <div className={styles.meetingLink}>
                          <Button onClick={() => window.open(batchDetails.meetingLink, "_blank")} text="Join Live Class" disabled={!isPaid} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h4>No Batch Details Available</h4>
                    <p>There are no batch details to display at the moment. Please check back later or contact support for assistance.</p>
                  </div>
                )}
              </div>

              {/* Course Syllabus Section */}
              <h3 className={styles.sectionTitle}>Course Syllabus</h3>
              <div className={styles.syllabusContainer}>
                {syllabus.length > 0 ? (
                  <div className={styles.accordion}>
                    {syllabus.map((item, index) => (
                      <div key={item._id} className={styles.accordionItem}>
                        <div className={`${styles.accordionHeader} ${expandedSyllabus === index ? styles.active : ""}`} onClick={() => setExpandedSyllabus(expandedSyllabus === index ? null : index)}>
                          <h3>
                            Chapter {index + 1}: {item.title}
                          </h3>
                          <span>{expandedSyllabus === index ? "−" : "+"}</span>
                        </div>
                        <div className={`${styles.accordionContent} ${expandedSyllabus === index ? styles.active : ""}`}>
                          <div className={styles.syllabusContent}>
                            <p>{item.description || "No description available."}</p>
                            {item.topics && item.topics.length > 0 && (
                              <div className={styles.topicsList}>
                                <h4>Topics:</h4>
                                <ul>
                                  {item.topics.map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${styles.emptyState} ${styles.withMargin}`}>
                    <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h4>No Syllabus Available</h4>
                    <p>This course doesn't have a syllabus yet. Please check back later or contact the course instructor for more information.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Upcoming Sessions</h2>
              <div className={`${styles.sessionListmain} ${!isPaid ? styles.lockedSession : ""}`}>
                <div className={styles.sessionListslider}>
                  {upcomingSessions.length > 0 && !loading ? (
                    <Slider {...settings}>
                      {upcomingSessions.map((session) => (
                        <div key={session._id}>
                          <div className={styles.sessionCard}>
                            <div className={styles.sessionVideo}>
                              <img src={session.sessionVideo} alt={session.sessionName} className={styles.videoThumbnail} />
                            </div>
                            <div className={styles.sessionDetails}>
                              <h3>{session.sessionName}</h3>
                              <p>{session.description}</p>
                              <div className={styles.sessionMeta}>
                                <div style={{ display: "flex", gap: "30px" }}>
                                  <span>
                                    <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
                                  </span>
                                  <span>
                                    <strong>Time:</strong> {session.time}
                                  </span>
                                </div>
                                <span>
                                  <strong>Instructor:</strong> {session.courseId?.instructor?.name}
                                </span>
                              </div>
                              {session.meetingLink && <Button onClick={() => isPaid && window.open(session.meetingLink, "_blank")} text="Join Meeting" disabled={!isPaid} />}
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
            </>
          )}
        </div>
      ) : (
        <div className={styles.textStyle}>
          <div className={styles.title}>
            <h3>{selectedCourse?.CourseName || "Course Name Not Available"}</h3>

            {/*  <div className={styles.infoRow} style={{ margin: '10px 0' }}>
                <span style={{ fontWeight: 'bold' }}>Purchased On: </span>
                <span>{formatPurchasedDate(coursePurchasedDate)}</span>
              </div> */}
          </div>
          <p>{selectedCourse?.description || "No description available"}</p>
          <div className={styles.alignments}>
            <div className={styles.allIconTextAlignment}>
              <div className={styles.iconText}>
                <ClockIcon />
                <span>{selectedCourse?.hours || "12"} hours</span>
              </div>
              <div className={styles.iconText}>
                <BathIcon />
                <span>{selectedCourse?.instructor?.name || "Instructor"}</span>
              </div>
              {/* <div className={styles.iconText}>
                <StarIcon />
                <span>4.8</span>
              </div> */}
              <div className={styles.iconText}>
                <ProfileGroupIcon />
                <span>{selectedCourse?.subscribed || "0"}</span>
              </div>
              <div className={styles.iconText}>
                <span>
                  Last-Update: {new Date(selectedCourse?.updatedAt || new Date()).toLocaleDateString("en-GB")} | {selectedCourse?.language?.slice(0, 1).toUpperCase() + selectedCourse?.language?.slice(1) || "English"}
                </span>
              </div>
            </div>
            {isPaid && (
              <Button
                fill
                text="Download Certificate"
                onClick={handleDownloadCertificate}
                style={{
                  background: isCertificateAvailable ? "#10B981" : "#9CA3AF",
                }}
                disabled={!isCertificateAvailable}
              />
            )}
            {!isPaid && (
              <div>
                <Button text={isProcessingPayment ? "Enrolling..." : "Enroll Now"} icon={isProcessingPayment ? null : RightBlackIcon} onClick={handlePayment} disabled={isProcessingPayment} />
              </div>
            )}
          </div>
          {isPaid && selectedCourse.courseType === "physical" && (
            <div>
              <div className={styles.physicaldetailsmain}>
                {selectedCourse?.location && (
                  <div className={styles.physicaldetail}>
                    <img src={LocationIcon} alt="ChatIcon" />
                    <p>{selectedCourse?.location}</p>
                  </div>
                )}
                {selectedCourse?.email && (
                  <div className={styles.physicaldetail}>
                    <img src={EmailIcon} alt="ChatIcon" />
                    <p>{selectedCourse?.email}</p>
                  </div>
                )}
                {selectedCourse?.phone && (
                  <div className={styles.physicaldetail}>
                    <img src={CallIcon} alt="ChatIcon" />
                    <p>{selectedCourse?.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.mainrelative}>
            <div className={styles.tabAlignment}>
              {chapters.map((chapter, index) => (
                <Button key={chapter._id} className={selectedChapter?._id == chapter._id ? styles.activeTab : ""} onClick={() => setSelectedChapter(chapter)} text={`Chapter ${chapter.chapterNo || index + 1}`} />
              ))}
            </div>
            {selectedChapter && chapters.length > 0 ? (
              <div className={`${!isPaid ? styles.locked : ""}`}>
                <div className={styles.items}>
                  <div className={styles.image}>
                    {selectedChapter.chapterVideo ? (
                      !isPaid ? (
                        <div className={styles.videoLocked}>
                          <div className={styles.lockOverlay}>
                            <img src={LockIcon} alt="Locked" />
                            <p>Enroll to unlock this video</p>
                          </div>
                          <img src={`https://img.youtube.com/vi/${selectedChapter.chapterVideo.split("v=")[1]}/hqdefault.jpg`} alt="Video thumbnail" className={styles.videoThumbnail} />
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

                          <CustomVideoPlayer
                            percentage={videoWatchingPercentage}
                            onPercentageChange={(percentage) => updateVideoPercentage(percentage)}
                            src={selectedChapter.chapterVideo}
                            // src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            // src="https://pipsveda.s3.us-east-1.azonaws.com/pipsveda/blob-1757418874956new%20latest.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAVJSBBJ5XMZUEA2XW%2F20250913%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250913T063038Z&X-Amz-Expires=3600&X-Amz-Signature=e0ed6c6d43a4038201fd1206007456c1387457b7cb86fb7335d92417d65ba51b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
                            userId={user?._id}
                            controls
                            controlsList="nodownload"
                            disablePictureInPicture
                            noremoteplayback
                            // className={styles.videoPlayer}
                          />
                        </div>
                      )
                    ) : (
                      <div className={styles.noVideo}>Video not available</div>
                    )}
                  </div>
                </div>
                <div className={styles.items}>
                  <div className={styles.details} style={{ marginLeft: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h4>
                        Chapter {selectedChapter.chapterNo} : {selectedChapter.chapterName || "Untitled Chapter"}
                      </h4>
                      {selectedChapter.courseTracking?.percentage > 0 && (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: `conic-gradient(rgb(106 16 185) 10.49%, rgb(229, 231, 235) ${videoWatchingPercentage}%, #E5E7EB 0)`,
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#1F2937",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              background: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "15px",
                            }}
                          >
                            {Math.round(videoWatchingPercentage)}%
                          </div>
                        </div>
                      )}
                    </div>
                    <p>
                      {selectedChapter.description || "No description available for this chapter."}
                      {!selectedChapter.description && <>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hendrerit, nulla non ultricies finibus, nibh purus ullamcorper augue, non tempor arcu nulla vitae nulla. Curabitur feugiat, ligula nec aliquam tincidunt, nulla ligula pretium eros, sed posuere neque lacus at neque.</>}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.courseDetailsBox}>
                <div className={styles.textStyle}>
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <img src="/assets/icons/no-course.svg" alt="No courses" className={styles.emptyImage} />
                    <h3>No Course Content Available</h3>
                    <p>This course doesn't have any chapters yet. Please check back later.</p>
                  </div>
                </div>
              </div>
            )}

            {/* {isPaid && (
              <ReviewSystem
                courseId={id}
                isPaid={isPaid}
                userId={user?._id}
              />
            )} */}

            {!isPaid && (
              <div className={styles.locksystem}>
                <div>
                  <div className={styles.iconCenter}>
                    <img src={LockIcon} alt="LockIcon" />
                  </div>
                  <span>Enroll Now to unlock</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
