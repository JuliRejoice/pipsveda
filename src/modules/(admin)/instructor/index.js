"use client";
import { getInstructor } from "@/compoents/api/instructor";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./instructor.module.scss";
import Button from "@/compoents/button";
import OutlineButton from "@/compoents/outlineButton";
import { useRouter } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Icons
const StarIcon = "/assets/icons/star.svg";
const StarEmptyIcon = "/assets/icons/star-empty.svg";
const StarHalfIcon = "/assets/icons/HalfStar.png";

function Instructor() {
  const [instructorData, setInstructorData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchInstructors = useCallback(async () => {
    try {
      const res = await getInstructor();
      const data = res.payload?.data || [];
      setInstructorData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching instructors", error);
      setError(error.message || "Failed to fetch instructors");
      setInstructorData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      let icon = StarEmptyIcon;

      if (i <= fullStars) {
        icon = StarIcon; 
      } else if (i === fullStars + 1 && hasHalfStar) {
        icon = StarHalfIcon;
      }

      stars.push(
        <img
          key={i}
          src={icon}
          alt={
            i <= fullStars
              ? "Filled star"
              : i === fullStars + 1 && hasHalfStar
              ? "Half star"
              : "Empty star"
          }
          className={styles.starIcon}
        />
      );
    }

    return <div className={styles.ratingContainer}>{stars}</div>;
  };

  if (loading) {
    return (
      <div className={styles.instructorContainer}>
        <div className={styles.header}>
          <Skeleton width={300} height={40} style={{ marginBottom: '10px' }} />
          <Skeleton width={400} height={20} />
        </div>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Skeleton width={370} height={200} />
              </div>
              <div className={styles.content}>
                <div className={styles.details}>
                  <Skeleton width={150} height={24} style={{ marginBottom: '10px' }} />
                  <Skeleton count={3} style={{ marginBottom: '10px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} width={16} height={16} style={{ marginRight: '4px' }} />
                      ))}
                    </div>
                    <Skeleton width={100} height={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <Button onClick={fetchInstructors} className={styles.retryButton}>
          Try Again
        </Button>
      </div>
    );
  }

  if (instructorData.length === 0) {
    return (
      <div className={styles.noInstructors}>
        <p>No instructors available at the moment.</p>
        <Button onClick={fetchInstructors} className={styles.retryButton}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.instructorContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Expert Instructors</h2>
        <p className={styles.subtitle}>
          Learn from industry professionals with years of experience
        </p>
      </div>

      <div className={styles.grid}>
        {instructorData.map((instructor) => (
          <div key={instructor._id} className={styles.card} onClick={() => router.push(`/instructor/${instructor._id}`)}>
            <div className={styles.imageWrapper}>
              <Image
                src={instructor.image}
                alt={instructor.name}
                width={200}
                height={200}
                className={styles.image}
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className={styles.content}>
              <div className={styles.details}>
                <h3 className={styles.name}>{instructor.name}</h3>

                <p className={styles.bio}>
                  {instructor.bio ||
                    "Passionate educator dedicated to student success."}
                </p>
                <div className={styles.footerContainer}>
                  {renderRating(instructor.averageRating || 0)}
                  <span
                    className={styles.viewProfileLink}
                    onClick={() => {
                      router.push(
                        `/instructor/${instructor._id}?name=${instructor.name}`
                      );
                    }}
                  >
                    View Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Instructor;