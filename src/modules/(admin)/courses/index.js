"use client";
import React, { useEffect, useState } from "react";
import styles from "./courses.module.scss";
import DownloadIcon from "@/icons/downloadIcon";
import LiveSessions from "./liveSessions";
import PhysicalEvents from "./physicalEvents";
import MyAlgobots from "./myAlgobots";
import { purchasedCourses } from "@/compoents/api/algobot";
import EmptyState from "../chapter/recentCourse/EmptyState";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import MyTelegram from "./mytelegram";
import Pagination from "@/compoents/pagination";
import Link from "next/link";
import Breadcumbs from "../breadcumbs";
import DashboardCard from "../dashboard/dashboardcard";

const TABS = {
  VIDEO_COURSES: "Pre Recorded Courses",
  LIVE_SESSIONS: "Live Online courses",
  PHYSICAL_EVENTS: "In Person Courses",
  MY_ALGOBOTS: "My AlgoBots",
  MY_TELEGRAM: "My Telegram",
};

const ITEMS_PER_PAGE = 8;

const CourseSkeleton = () => {
  return Array(4)
    .fill(0)
    .map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.griditems}>
        <div className={styles.cardImage}>
          <Skeleton
            height={220}
            className={styles.cardImageskl}
            style={{ borderRadius: "10px" }}
          />
        </div>
        <div className={styles.detailsAlignment}>
          <Skeleton height={24} width="80%" />
          <div className={styles.twoalignment}>
            <div className={styles.text}>
              <Skeleton
                circle
                width={22}
                height={22}
                style={{ marginRight: "8px" }}
              />
              <Skeleton width={100} height={16} />
            </div>
            <div className={styles.text}>
              <Skeleton
                circle
                width={22}
                height={22}
                style={{ marginRight: "8px" }}
              />
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
  const [error, setError] = useState("");
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
        const response = await purchasedCourses({
          type: "RECORDED",
          page: pagination.currentPage,
          limit: ITEMS_PER_PAGE,
        });
        if (response && response.success) {
          setRecordedCourses(response.payload.RECORDED);
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            totalItems: response.payload.RECORDED.length,
          }));
        } else {
          throw new Error(response?.message || "Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Failed to load courses");
        toast.error(err.message || "Failed to load courses");
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
                <Link
                  href={`/my-courses/course/${recordedCourse?.courseId?._id}`}
                  key={index}
                >
                  <div className={styles.griditems}>
                    <div className={styles.cardImage}>
                      <img
                        src={recordedCourse?.courseId?.courseVideo}
                        alt="CardImage"
                      />
                    </div>
                    <div className={styles.detailsAlignment}>
                      <h3>{recordedCourse?.courseId?.CourseName}</h3>
                      <h4>
                        Category :{" "}
                        {recordedCourse?.courseId?.courseCategory?.name}
                      </h4>
                      <div className={styles.twoalignment}>
                        <div className={styles.text}>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.66667 3.08333C2.66667 1.9325 3.59917 1 4.75 1C5.90083 1 6.83333 1.9325 6.83333 3.08333C6.83333 4.23417 5.90083 5.16667 4.75 5.16667C3.59917 5.16667 2.66667 4.23417 2.66667 3.08333ZM6.83333 9.33333C6.3725 9.33333 6 9.70583 6 10.1667V13.5H4.33333C3.41417 13.5 2.66667 12.7525 2.66667 11.8333V9.33333C2.66667 8.41417 3.41417 7.66667 4.33333 7.66667H12.6667C13.1275 7.66667 13.5 7.29417 13.5 6.83333C13.5 6.3725 13.1275 6 12.6667 6H4.33333C2.495 6 1 7.495 1 9.33333V11.8333C1 13.0617 1.675 14.125 2.66667 14.7033V20.1667C2.66667 20.6275 3.03917 21 3.5 21C3.96083 21 4.33333 20.6275 4.33333 20.1667V15.1667H6V20.1667C6 20.6275 6.3725 21 6.83333 21C7.29417 21 7.66667 20.6275 7.66667 20.1667V10.1667C7.66667 9.70583 7.29417 9.33333 6.83333 9.33333ZM17.25 1H9.33333C8.8725 1 8.5 1.3725 8.5 1.83333C8.5 2.29417 8.8725 2.66667 9.33333 2.66667H17.25C18.3992 2.66667 19.3333 3.60083 19.3333 4.75V9.75C19.3333 10.8992 18.3992 11.8333 17.25 11.8333H10.1667C9.70583 11.8333 9.33333 12.2058 9.33333 12.6667C9.33333 13.1275 9.70583 13.5 10.1667 13.5H17.25C19.3175 13.5 21 11.8175 21 9.75V4.75C21 2.6825 19.3175 1 17.25 1Z"
                              fill="#6F756D"
                              stroke="#FFF5F1"
                              strokeWidth="0.4"
                            />
                          </svg>
                          <span>
                            {recordedCourse?.courseId?.instructor?.name}
                          </span>
                        </div>
                        <div className={styles.text}>
                          {/* <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">

                                                <span>8/12 Lessons</span> */}
                          <p>{recordedCourse?.courseId?.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.coursesPagealignment}>
      <div className={styles.title}>
        <h2>My Library</h2>
        <DashboardCard/>
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
              className={`${styles.algotabs} ${
                activeTab === tab ? styles.active : ""
              }`}
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
