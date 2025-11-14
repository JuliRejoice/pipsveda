import React, { useState, useEffect } from "react";
import {
  getInstructorById,
  getTotalStudents,
} from "@/compoents/api/instructor";
import styles from "./instructorProfile.module.scss";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function InstructorProfile({ id }) {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const response = await getInstructorById(id);
        if (response && response.payload && response.payload.data) {
          // Handle both array response and single object
          const instructorData = Array.isArray(response.payload.data)
            ? response.payload.data[0]
            : response.payload.data;
          setInstructor(instructorData);
        }
      } catch (err) {
        console.error("Error fetching instructor:", err);
        setError("Failed to load instructor profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstructor();
    }
  }, [id]);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        setLoading(true);
        const response = await getTotalStudents(id);

        if (response.success) {
          setTotalStudents(response.payload);
        }
      } catch (err) {
        console.error("Error fetching total students:", err);
        setError("Failed to load total students");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTotalStudents();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <Skeleton circle={true} width={120} height={120} />
          </div>
          <div className={styles.profileInfo}>
            <Skeleton
              width={200}
              height={30}
              style={{ marginBottom: "15px" }}
            />
            <div className={styles.stats}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={styles.statItem}>
                  <Skeleton
                    width={30}
                    height={24}
                    style={{ marginBottom: "5px" }}
                  />
                  <Skeleton width={60} height={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <Skeleton width={100} height={28} style={{ marginBottom: "10px" }} />
          <Skeleton count={1} style={{ marginBottom: "10px" }} />
          <Skeleton width="80%" />
        </div>

        <div className={styles.contactInfo}>
          <Skeleton width={150} height={28} style={{ marginBottom: "15px" }} />
          <div className={styles.contactItem}>
            <Skeleton
              width={50}
              height={20}
              style={{ marginRight: "10px", display: "inline-block" }}
            />
            <Skeleton
              width={200}
              height={20}
              style={{ display: "inline-block" }}
            />
          </div>
          <div className={styles.contactItem} style={{ marginTop: "10px" }}>
            <Skeleton
              width={100}
              height={20}
              style={{ marginRight: "10px", display: "inline-block" }}
            />
            <Skeleton
              width={150}
              height={20}
              style={{ display: "inline-block" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!instructor) {
    return <div className={styles.notFound}>Instructor not found</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <Image
            src={instructor.image || "/images/avatar-placeholder.png"}
            alt={`${instructor.name}'s profile`}
            width={120}
            height={120}
            className={styles.avatar}
            unoptimized={instructor.image?.includes("amazonaws.com")}
          />
        </div>
        <div className={styles.profileInfo}>
          <p className={styles.name}>{instructor.name}</p>
          {/* <p className={styles.title}>Instructor</p>
          {instructor.bio && <p className={styles.bio}>{instructor.bio}</p>} */}

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {instructor.courses.length}
              </span>
              <span className={styles.statLabel}>Courses</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalStudents || "0"}</span>
              <span className={styles.statLabel}>Students</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {instructor.averageRating
                  ? instructor.averageRating.toFixed(1)
                  : "N/A"}
              </span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2>About Me</h2>
        <p className={styles.aboutText}>
          {instructor.bio || "No description available."}
        </p>
      </div>

      <div className={styles.contactInfo}>
        <h2>Contact Information</h2>
        <div className={styles.contactItem}>
          <span className={styles.contactLabel}>Email:</span>
          <a
            href={`mailto:${instructor.email}`}
            className={styles.contactValue}
          >
            {instructor.email}
          </a>
        </div>
        <div className={styles.contactItem}>
          <span className={styles.contactLabel}>Member Since:</span>
          <span className={styles.contactValue}>
            {new Date(instructor.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfile;
