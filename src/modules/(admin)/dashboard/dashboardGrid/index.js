"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboardGrid.module.scss";
import UserIcon from "@/icons/userIcon";
import CourseIcon from "@/icons/courseIcon";
import Algobot from "@/icons/algobot";
import {
  getDashboardData,
  getAlgobots,
  getCourses,
  getBots,
  purchasedAllCourses,
} from "@/compoents/api/dashboard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { use } from "marked";
import Button from "@/compoents/button";
import { useRouter } from "next/navigation";
import Dropdownarrow from "@/icons/dropdownarrow";

function DashboardGrid() {
  const [data, setData] = useState({});
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [purchasedBots, setPurchasedBots] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allAlgobots, setAllAlgobots] = useState([]);

  const [loading, setLoading] = useState({
    purchasedCourses: true,
    purchasedBots: true,
    courses: true,
    algobots: true,
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          centerMode: true,
          centerPadding: "30px",
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
          arrows: false,
        },
      },
    ],
  };

  const fetchAllPurchasedItems = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        purchasedCourses: true,
        purchasedBots: true,
      }));

      // Fetch purchased items (both courses and bots)
      const response = await purchasedAllCourses({
        type: "ALL", // or the appropriate type that returns both
        page: 1,
        limit: 10,
      });

      console.log("Full API Response:", response);

      const courseItems = [
        ...(response?.payload?.PHYSICAL || []).map((item) => ({
          ...(item.courseId || item.botId?.courseId || item),
          type: "physical",
          purchaseInfo: item,
        })),
        ...(response?.payload?.LIVE || []).map((item) => ({
          ...(item.courseId || item.botId?.courseId || item),
          type: "live",
          purchaseInfo: item,
        })),
        ...(response?.payload?.RECORDED || []).map((item) => ({
          ...(item.courseId || item.botId?.courseId || item),
          type: "recorded",
          purchaseInfo: item,
        })),
      ];

      const botItems = (response?.payload?.BOTS || [])
        .slice(0, 3)
        .map((item) => {
          const botData = item.botId || item.courseId?.botId || item;
          return {
            ...botData,
            type: "algobot",
            purchaseInfo: item,
          };
        });

      setPurchasedCourses(courseItems);
      setPurchasedBots(botItems);
    } catch (error) {
      console.error("Error in fetchAllPurchasedItems:", {
        error,
        message: error.message,
        response: error.response?.data,
      });
    } finally {
      setLoading((prev) => ({
        ...prev,
        purchasedCourses: false,
        purchasedBots: false,
      }));
    }
  };

  const fetchCourse = async () => {
    try {
      setLoading((prev) => ({ ...prev, courses: true }));
      const [coursesResponse, purchasedResponse] = await Promise.all([
        getCourses({
          page: 1,
          limit: 100, // Increased to get all courses
        }),
        purchasedAllCourses({
          type: "ALL",
          page: 1,
          limit: 100,
        }),
      ]);

      if (coursesResponse.success) {
        // Get all purchased course IDs
        const purchasedCourseIds = new Set();

        // Add all purchased course IDs to the set
        ["PHYSICAL", "LIVE", "RECORDED"].forEach((type) => {
          const items = purchasedResponse?.payload?.[type] || [];
          items.forEach((item) => {
            const courseId = item.courseId?._id || item.courseId;
            if (courseId) {
              purchasedCourseIds.add(courseId);
            }
          });
        });

        // Filter out purchased courses
        const availableCourses = coursesResponse.payload.data.filter(
          (course) => !purchasedCourseIds.has(course._id)
        );

        setAllCourses(availableCourses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };
  const fetchBot = async () => {
    try {
      setLoading((prev) => ({ ...prev, algobots: true }));
      const response = await getBots({
        page: 1,
        limit: 10,
      });

      if (response.success) {
        setAllAlgobots(response.payload.data || []);
      }
    } catch (error) {
      console.error("Error fetching algobots:", error);
    } finally {
      setLoading((prev) => ({ ...prev, algobots: false }));
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchBot();
    fetchAllPurchasedItems();
  }, []);

  // Course card component
  const CourseCard = ({ course, isPurchased = false }) => {
    const router = useRouter();

      const handleCardClick = (e) => {
        if (
          e.target.tagName === "BUTTON" ||
          e.target.closest("button") ||
          e.target.tagName === "A" ||
          e.target.closest("a")
        ) {
          return;
        }
        router.push(`/course/${course._id}`);
      };

    return (
      <div
        className={`${styles.card} ${styles.clickableCard}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick(e)}
      >
        <div className={styles.imageContainer}>
          <img
            src={course.courseVideo || "/placeholder-course.jpg"}
            alt={course.CourseName}
            className={styles.cardImage}
          />
          {isPurchased && (
            <span className={styles.purchasedBadge}>PURCHASED</span>
          )}
        </div>
        <div className={styles.cardContent}>
          <div className={styles.courseHeader}>
            <h4>{course.CourseName}</h4>
          </div>

          <div className={styles.instructorInfo}>
            <img
              src={course.instructor?.image || "/default-avatar.png"}
              alt={course.instructor?.name}
              className={styles.instructorImage}
            />
            <span className={styles.instructorName}>
              <div>{course.instructor?.name}</div>
              <div>
                {course.language} | {course.hours} hours
              </div>
            </span>
          </div>

          <p className={styles.description}>
            {course.description.length > 100
              ? `${course.description.substring(0, 100)}...`
              : course.description}
          </p>

          {isPurchased && course.completedPercentage !== undefined && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${course.completedPercentage}%` }}
              ></div>
              <span>{course.completedPercentage}% Complete</span>
            </div>
          )}

          <div className={styles.footer}>
            <div className={styles.footerContent}>
              {!isPurchased && course.price && (
                <p className={styles.price}>${course.price}</p>
              )}
              <button
                onClick={() => router.push(`/course/${course._id}`)}
                className={styles.enrollButton}
              >
                {isPurchased
                  ? "View Course"
                  : course.price
                  ? "Enroll Now"
                  : "Free"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatPlanType = (planType) => {
    if (!planType) return "";
    // Check if the plan type contains a number followed by 'month' or 'months' (case insensitive)
    const match = planType.match(/^(\d+)\s*(month|months?)$/i);
    if (match) {
      const number = match[1];
      const word = number === "1" ? "Month" : "Months";
      return `${number} ${word}`;
    }
    return planType;
  };

  const AlgobotCard = ({ bot, isPurchased = false }) => {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Set the initial selected plan
    useEffect(() => {
      if (bot.strategyPlan?.length > 0) {
        setSelectedPlan(bot.strategyPlan[0]?._id);
      }
    }, [bot.strategyPlan]);

    const handlePlanChange = (botId, planId) => {
      setSelectedPlan(planId);
    };

    const handleButtonClick = () => {
      if (isPurchased) {
        router.push(`/my-courses/algobot/${bot.strategyId?._id}`);
      } else if (selectedPlan) {
        router.push(`/my-courses/algobot/${bot._id}`);
      }
    };

    return (
      <div
        className={`${styles.card} ${styles.clickableCard}`}
        onClick={handleButtonClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleButtonClick(e)}
      >
        <div className={styles.imageContainer}>
          <img
            src={
              isPurchased
                ? bot?.strategyId?.imageUrl
                : bot?.imageUrl || "/placeholder-bot.jpg"
            }
            alt={bot.title}
            className={styles.cardImage}
          />
          {isPurchased && (
            <span className={styles.purchasedBadge}>PURCHASED</span>
          )}
        </div>
        <div className={styles.cardContent}>
          <div className={styles.courseHeader}>
            <h4>{isPurchased ? bot.strategyId?.title : bot.title}</h4>
          </div>

          <p className={styles.description}>
            {bot.shortDescription ||
              "Professional trading bot for advanced strategies"}
          </p>

          {!isPurchased && bot.strategyPlan?.length > 0 && (
            <div className={styles.planDropdownContainer}>
              <div className={styles.dropdownmain}>
                <div
                  className={styles.dropdownhead}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === bot._id ? null : bot._id);
                  }}
                >
                  <span>
                    {selectedPlan
                      ? formatPlanType(
                          bot.strategyPlan.find(
                            (plan) => plan._id === selectedPlan
                          )?.planType
                        )
                      : "Select a plan"}
                  </span>
                  <div className={styles.dropdownarrow}>
                    <Dropdownarrow />
                  </div>
                </div>

                {openDropdown === bot._id && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownspacing}>
                      {bot.strategyPlan.map((plan) => (
                        <div
                          key={plan._id}
                          className={styles.iconText}
                          onClick={() => {
                            handlePlanChange(bot._id, plan._id);
                            setOpenDropdown(null);
                          }}
                        >
                          <span>{formatPlanType(plan.planType)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.planDetails}>
                {bot.strategyPlan.map((plan) => (
                  <div
                    key={plan._id}
                    className={styles.planDetailItem}
                    style={{
                      display: selectedPlan === plan._id ? "block" : "none",
                    }}
                  >
                    <div
                      className={`${styles.contentAlignment} ${styles.priceContainer}`}
                    >
                      <span>{formatPlanType(plan.planType)}:</span>
                      <div className={styles.priceWrapper}>
                        <span className={styles.priceAmount}>
                          ${Number(plan.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.contentAlignment}>
                      <span>M.R.P:</span>
                      <h5>${Number(plan.initialPrice).toFixed(2)}</h5>
                    </div>
                    <div className={styles.contentAlignment}>
                      <span>Discount:</span>
                      <h5 className={styles.dangerText}>
                        {plan.discount > 0 ? `-${plan.discount}%` : "0%"}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isPurchased && bot.purchaseInfo && (
            <div className={styles.purchasedPlanDetails}>
              <div className={styles.purchasedPlanHeader}>
                <span>Your Plan:</span>
                <span className={styles.planType}>
                  {formatPlanType(bot.purchaseInfo.planType || bot.planType)}
                </span>
              </div>
              <div className={styles.planInfo}>
                <div className={styles.planInfoItem}>
                  <span>Price:</span>
                  <span className={styles.planPrice}>
                    ${bot.purchaseInfo.price || bot.price}
                    {bot.purchaseInfo.discount > 0 && (
                      <span className={styles.originalPrice}>
                        ${bot.purchaseInfo.initialPrice}
                      </span>
                    )}
                  </span>
                </div>
                {bot.purchaseInfo.startDate && (
                  <div className={styles.planInfoItem}>
                    <span>Start Date:</span>
                    <span>
                      {new Date(
                        bot.purchaseInfo.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {bot.purchaseInfo.endDate && (
                  <div className={styles.planInfoItem}>
                    <span>End Date:</span>
                    <span>
                      {new Date(bot.purchaseInfo.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {bot.purchaseInfo.status && (
                  <div className={styles.planInfoItem}>
                    <span>Status:</span>
                    <span
                      className={styles[bot.purchaseInfo.status.toLowerCase()]}
                    >
                      {bot.purchaseInfo.status.charAt(0).toUpperCase() +
                        bot.purchaseInfo.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              <button
                onClick={handleButtonClick}
                className={styles.enrollButton}
              >
                {isPurchased ? "View Bot" : "Get Started"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SliderWrapper = ({
    title,
    items,
    loading,
    renderItem,
    emptyMessage,
    isPurchased = false,
  }) => (
    <div className={styles.sliderContainer}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : items.length > 0 ? (
        <Slider {...sliderSettings}>
          {items.map((item) => (
            <div key={item._id} className={styles.slide}>
              {renderItem({ ...item, isPurchased })}
            </div>
          ))}
        </Slider>
      ) : (
        <div className={styles.emptyMessage}>{emptyMessage}</div>
      )}
    </div>
  );

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardCardGrid}>
        <div className={`${styles.dashboardcard} ${styles.purchasedSection}`}>
          <div className={styles.dashboardcardtitle}>
            <h1>Purchased Courses</h1>
            <span>
              <CourseIcon />
              Total Purchased Courses : {purchasedCourses.length}
            </span>
          </div>
          <div className={styles.sliderSection}>
            <SliderWrapper
              items={purchasedCourses}
              loading={loading.purchasedCourses}
              renderItem={(course) => (
                <CourseCard course={course} isPurchased />
              )}
              emptyMessage="You don't have any Courses yet."
            />
          </div>
        </div>

        {/* Explore Courses Section */}
        <div className={`${styles.dashboardcard} ${styles.exploreSection}`}>
          <div className={styles.dashboardcardtitle}>
            <h1>Explore Courses</h1>
            <span>
              <CourseIcon />
              Total Courses : {allCourses.length}
            </span>
          </div>
          <div className={styles.sliderSection}>
            <SliderWrapper
              items={allCourses}
              loading={loading.courses}
              renderItem={(course) => <CourseCard course={course} />}
              emptyMessage="No courses available at the moment."
            />
          </div>
        </div>
        <div className={`${styles.dashboardcard} ${styles.purchasedSection}`}>
          <div className={styles.dashboardcardtitle}>
            <h1>Purchased AlgoBots</h1>
            <span>
              <Algobot />
              Total Purchased AlgoBots : {purchasedBots.length}
            </span>
          </div>
          <div className={styles.sliderSection}>
            <SliderWrapper
              items={purchasedBots}
              loading={loading.purchasedBots}
              renderItem={(bot) => <AlgobotCard bot={bot} isPurchased />}
              emptyMessage="You don't have any AlgoBots yet."
            />
          </div>
        </div>

        {/* Explore AlgoBots Section */}
        <div className={`${styles.dashboardcard} ${styles.exploreSection}`}>
          <div className={styles.dashboardcardtitle}>
            <h1>Explore AlgoBots</h1>
            <span>
              <Algobot />
              Total AlgoBots : {allAlgobots.length}
            </span>
          </div>
          <div className={styles.sliderSection}>
            <SliderWrapper
              items={allAlgobots}
              loading={loading.algobots}
              renderItem={(bot) => <AlgobotCard bot={bot} />}
              emptyMessage="No AlgoBots available at the moment."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardGrid;
