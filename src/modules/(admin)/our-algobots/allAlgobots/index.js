"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./allalgobots.module.scss";
import OutlineButton from "@/compoents/outlineButton";
import Pagination from "@/compoents/pagination";
import { getAlgobot, getAlgobotCategories } from "@/compoents/api/algobot";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick/lib/slider";
import Arrowicon from "@/icons/arrowicon";
import { getAlgobots } from "@/compoents/api/dashboard";
import Dropdownarrow from "@/icons/dropdownarrow";
const RightBlackIcon = "/assets/icons/right-black.svg";
const CardImage = "/assets/images/crypto.png";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div className={styles.nextarrow} onClick={onClick}>
      <div className={styles.arrow}>
        <Arrowicon />
      </div>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div className={styles.prevarrow} onClick={onClick}>
      <div className={styles.arrow}>
        <Arrowicon />
      </div>
    </div>
  );
}

// Skeleton component to match the card layout
const CardSkeleton = () => (
  <div className={styles.griditemsloader}>
    <div className={styles.image}>
      <Skeleton height={200} style={{ borderRadius: "12px" }} />
    </div>
    <div className={styles.details}>
      <Skeleton width={200} height={24} />
      <Skeleton count={2} />
      <div className={styles.twoColgrid}>
        <div className={styles.items}>
          <Skeleton width="100%" height="95px" />
        </div>
        <div className={styles.items}>
          <Skeleton width="100%" height="95px" />
        </div>
      </div>
      <Skeleton height={46} width={155} />
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className={styles.emptyState}>
    <img
      src="/assets/icons/no-course.svg"
      alt="No algobots"
      className={styles.emptyImage}
    />
    <h3>No AlgoBots Available</h3>
    <p>
      There are no AlgoBots to display at the moment. Please check back later or
      try a different search.
    </p>
  </div>
);

export default function AllAlgobots() {
  const [bot, setBot] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [selectedPlans, setSelectedPlans] = useState({});
  const [openDropdown, setOpenDropdown] = useState(bot[0]?._id || null);
const dropdownRefs = useRef({});

const getMonthsFromPlan = (planType) => {
  const match = planType.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};


useEffect(() => {
  function handleClickOutside(event) {
    if (openDropdown) {
      const dropdownEl = dropdownRefs.current[openDropdown];

      if (dropdownEl && !dropdownEl.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [openDropdown]);



  const handlePlanChange = (strategyId, planId) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [strategyId]: planId,
    }));
  };

  const getCategories = async () => {
    try {
      const response = await getAlgobotCategories();
      setCategories(response.payload);
      setSelectedCategory(response.payload[0]._id);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAlgobotData = async () => {
    try {
      setLoading(true);
      const response = await getAlgobots(
        selectedCategory,
        pagination.currentPage,
        pagination.itemsPerPage
      );
      const bots = Array.isArray(response)
        ? response
        : response?.payload.result || [];
      setBot(bots);

      // Set the first plan as selected for each strategy
      const initialSelectedPlans = {};
      bots.forEach((strategy) => {
        if (strategy.strategyPlan?.length > 0) {
          initialSelectedPlans[strategy._id] = strategy.strategyPlan[0]._id;
        }
      });
      setSelectedPlans((prev) => ({
        ...prev,
        ...initialSelectedPlans,
      }));

      setPagination((prev) => ({
        ...prev,
        currentPage: pagination.currentPage,
        totalItems: Array.isArray(response)
          ? response.length
          : response?.count || 0,
      }));
    } catch (error) {
      console.error("Error fetching algobot data:", error);
      setError("Failed to fetch algobot data");
      setBot([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    fetchAlgobotData();
  }, [pagination.currentPage, selectedCategory]);


  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)
    ) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  // Show skeleton loading while data is being fetched
  if (loading) {
    return (
      <div className={styles.differentAlgobots}>
      <div className="container">
        <div className={styles.arbitrageAlgoAlignment}>
          <div className={styles.title}>
            <Skeleton width={200} height={32} />
          </div>
          <div className={styles.grid}>
            {[...Array(3)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Show empty state if no bots are found
  if (loading && (!bot || bot.length === 0)) {
    return (
      <div className={styles.arbitrageAlgoAlignment}>
        <div className={styles.title}>
          <h2>Arbitrage Algo</h2>
        </div>
        <EmptyState />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.differentAlgobots}>
    <div className="container">
      <div className={styles.arbitrageAlgoAlignment}>
        <div className={styles.algotabsmain}>
          <div className={styles.algotabs}>
            {categories?.map((bots, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.algotabs} ${
                  selectedCategory === bots._id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(bots._id)}
              >
                <span>{bots.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.grid}>
          {bot?.length > 0 ? (
            bot.map((strategy) => (
              <div className={styles.griditems} key={strategy._id}>
                <div className={styles.image}>
                  <img
                    src={strategy.imageUrl || CardImage}
                    alt={strategy.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = CardImage;
                    }}
                  />
                </div>
                <div className={styles.details}>
                  <h3>{strategy.title}</h3>
                  <p>{strategy.shortDescription}</p>
                  {strategy.strategyPlan?.length > 0 && (
                    <div className={styles.planDropdownContainer}>
                      <div
                        className={styles.dropdownmain}
                        ref={(el) => (dropdownRefs.current[strategy._id] = el)}
                      >
                        <div
                          className={styles.dropdownhead}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === strategy._id
                                ? null
                                : strategy._id
                            )
                          }
                        >
                          <span>
                            {strategy.strategyPlan.find(
                              (plan) =>
                                plan._id ===
                                (selectedPlans[strategy._id] ||
                                  strategy.strategyPlan[0]?._id)
                            )?.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2') || "Select a plan"}
                          </span>
                          <div className={styles.dropdownarrow}>
                            <Dropdownarrow />
                          </div>
                        </div>

                        {openDropdown === strategy._id && (
                          <div className={styles.dropdown}>
                            <div className={styles.dropdownspacing}>
                              {[...strategy.strategyPlan]
  .sort((a, b) => getMonthsFromPlan(a.planType) - getMonthsFromPlan(b.planType))
  .map((plan) => (
                                <div
                                  key={plan._id}
                                  className={styles.iconText}
                                  onClick={() => {
                                    handlePlanChange(strategy._id, plan._id);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <span>{plan.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.planDetails}>
                        {strategy.strategyPlan.map((plan) => (
                          <div
                            key={plan._id}
                            className={styles.planDetailItem}
                            style={{
                              display:
                                selectedPlans[strategy._id] === plan._id
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <div
                              className={`${styles.contentAlignment} ${styles.priceContainer}`}
                            >
                              <span>{plan.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2')}:</span>
                              <div className={styles.priceWrapper}>
                                <span className={styles.priceCurrency}>$</span>
                                <span className={styles.priceAmount}>
                                  {plan.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className={styles.contentAlignment}>
                              <span>M.R.P:</span> 
                              <h5>${plan.initialPrice}</h5>
                            </div>
                            <div className={styles.contentAlignment}>
                              <span>Discount:</span>
                              <h5 className={styles.dangerText}>
                                {plan.discount > 0
                                  ? `-${plan.discount}%`
                                  : "0%"}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <OutlineButton
                    text="Buy Now"
                    icon={RightBlackIcon}
                    onClick={() =>
                      router.push(`/algobot-details?id=${strategy._id}`)
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No AlgoBots Available</h3>
              <p>There are no AlgoBots to display at the moment.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
    </div>
  );
}
