'use client'
import { getCourses } from "@/compoents/api/dashboard";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./inPersonCourse.module.scss";
import OutlineButton from "@/compoents/outlineButton";
import RenderSkeleton from "../../recentCourse/RenderSkeleton";
import EmptyState from "../../recentCourse/EmptyState";


const CardImage = '/assets/images/crypto.png';
const BathIcon = '/assets/icons/bath.svg';
const RightBlackIcon = '/assets/icons/right-black.svg';

function InPersonCourse() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await getCourses({ courseType: "physical" });
      setCourses(data?.payload?.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again later.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className={styles.recentCourseAlignment}>
      <div className={styles.title}>
        <h2>In Person Course</h2>
      </div>

      {error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className={styles.grid}>
          <RenderSkeleton />
        </div>
      ) : courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.grid}>
          {courses.map((course) => (
            <div className={styles.griditems} key={course?._id}>
              <div className={styles.image}>
                <img
                  src={course.courseVideo || CardImage}
                  alt={course.CourseName || "Course"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = CardImage;
                  }}
                />
              </div>
              <div className={styles.details}>
                <h3>{course?.CourseName || "Untitled Course"}</h3>
                <p>{course?.description || "No description available."}</p>
                <div className={styles.twoContentAlignment}>
                  <h4>${course?.price || 299}</h4>
                  <div className={styles.iconText}>
                    <img src={BathIcon} alt="Instructor" />
                    <span>{course?.instructor || "John Doe"}</span>
                  </div>
                </div>
                <OutlineButton
                  text="Enroll Now"
                  icon={RightBlackIcon}
                  onClick={() =>
                    router.push(`/courses/in-person/${course?._id}`)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InPersonCourse;
