"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./telegramCommunities.module.scss";
import ArrowVec from "@/icons/arrowVec";
import Button from "@/compoents/button";
import { getTelegramFordashboard } from "@/compoents/api/dashboard";
import { useRouter } from "next/navigation";
import Dropdownarrow from "@/icons/dropdownarrow";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function TelegramCommunities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();

  // State
  const [telegramChannels, setTelegramChannels] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tilts, setTilts] = useState([]);
  const [hovers, setHovers] = useState([]);

  const dropdownRefs = useRef({});

  // 👉 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown) {
        const dropdownElement = dropdownRefs.current[openDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // 👉 Fetch Telegram Channels with retry logic
  const fetchTelegramChannels = async (retry = 3) => {
    try {
      const response = await getTelegramFordashboard();

      const data = response?.payload?.data;
      if (Array.isArray(data)) {
        setTelegramChannels(data);
        return;
      }
      throw new Error("Invalid response");
    } catch (err) {
      if (retry > 0) {
        setTimeout(() => fetchTelegramChannels(retry - 1), 300);
      } else {
        console.error("Failed after retries:", err);
        setTelegramChannels([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelegramChannels();
  }, []);

  // 👉 Initialize selected plans AND tilt states when data loads
  useEffect(() => {
    if (telegramChannels.length > 0) {
      const initialPlans = {};
      telegramChannels.forEach((channel) => {
        initialPlans[channel._id] = channel.telegramPlan?.[0]?._id;
      });
      setSelectedPlans(initialPlans);

      // Dynamic tilt array setup
      setTilts(
        Array.from({ length: telegramChannels.length }, () => ({ x: 0, y: 0 }))
      );
      setHovers(
        Array.from({ length: telegramChannels.length }, () => false)
      );
    }
  }, [telegramChannels]);

  // 👉 Tilt animation handlers
  const handleMouseMove = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    const maxRotate = 10;
    const rotateY = (x / (rect.width / 2)) * maxRotate;
    const rotateX = (-y / (rect.height / 2)) * maxRotate;

    setTilts((prev) => {
      const next = [...prev];
      next[index] = { x: rotateX, y: rotateY };
      return next;
    });
  };

  const handleMouseEnter = (index) => {
    setHovers((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleMouseLeave = (index) => {
    setHovers((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setTilts((prev) => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  const handlePlanChange = (channelId, planId) => {
    setSelectedPlans((prev) => ({ ...prev, [channelId]: planId }));
  };

  // 👉 UI Helpers
  const formatPlanType = (plan) =>
    plan?.planType?.replace(/(\d+)([A-Za-z]+)/, "$1 $2");

  const getMonthsFromPlan = (planType) => {
  const match = planType.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};


  return (
    <div className={styles.telegramCommunities}>
      <div className="container" ref={ref}>

        {/* TITLE */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2>Join Private Telegram Communities</h2>
          <p>Connect with experts and peers for daily insights, trade setups, and support.</p>
        </motion.div>

        {/* LOADING STATE */}
        {/* {loading && (
          <div className={styles.loadingContainer}>Loading channels...</div>
        )} */}

        {/* EMPTY STATE */}
        {!loading && telegramChannels.length === 0 && (
          <div className={styles.noData}>No channels found</div>
        )}

        {/* CARDS */}
        {!loading && telegramChannels.length > 0 && (
          <motion.div
            className={telegramChannels.length > 2 ? styles.grid : styles.flex}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {telegramChannels.slice(0, 3).map((channel, i) => (
              <motion.div
                key={channel._id}
                className={styles.griditems}
                variants={cardVariants}
                style={{
                  transformPerspective: 1000,
                  transformStyle: "preserve-3d",
                  willChange: "transform"
                }}
                onMouseMove={(e) => handleMouseMove(i, e)}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                animate={{
                  rotateX: tilts[i]?.x || 0,
                  rotateY: tilts[i]?.y || 0,
                  scale: hovers[i] ? 1.02 : 1,
                  boxShadow: hovers[i]
                    ? "0 12px 30px rgba(0,0,0,0.15)"
                    : "0 6px 12px rgba(0,0,0,0.06)"
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  mass: 0.6
                }}
              >
                {/* IMAGE */}
                <div className={styles.cardImageContainer}>
                  {channel.image && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={channel.image}
                        alt={channel.channelName}
                        className={styles.channelImage}
                      />
                    </div>
                  )}
                  {channel.logo && (
                    <div className={styles.logoContainer}>
                      <img
                        src={channel.logo}
                        alt={`${channel.channelName} logo`}
                        className={styles.channelLogo}
                      />
                    </div>
                  )}
                </div>

                {/* HEADER */}
                <div className={styles.cardHeader}>
                  <div className={styles.textStyle}>
                    <h3>{channel.channelName}</h3>
                  </div>
                  <ArrowVec />
                </div>

                {/* DESCRIPTION */}
                <div className={styles.listAlignment}>
                  <p>{channel.description || "Join our community for insights and updates."}</p>
                </div>

                {/* PRICING SECTION */}
                <div className={styles.priceSection}>
                  <div className={styles.twoColgrid}>
                    {channel.telegramPlan?.length > 0 && (
                      <>
                        {/* DROPDOWN */}
                        <div
                          className={styles.dropdownmain}
                          ref={(el) =>
                            (dropdownRefs.current[channel._id] = el)
                          }
                        >
                          <div
                            className={styles.dropdownhead}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === channel._id
                                  ? null
                                  : channel._id
                              );
                            }}
                          >
                            <span>
                              {formatPlanType(
                                channel.telegramPlan.find(
                                  (p) =>
                                    p._id === selectedPlans[channel._id]
                                ) || channel.telegramPlan[0]
                              )}
                            </span>
                            <div className={styles.dropdownarrow}>
                              <Dropdownarrow />
                            </div>
                          </div>

                          {openDropdown === channel._id && (
                            <div className={styles.dropdown}>
                              <div className={styles.dropdownspacing}>
                                {[...channel.telegramPlan]
  .sort((a, b) => getMonthsFromPlan(a.planType) - getMonthsFromPlan(b.planType))
  .map((plan) => (
                                  <div
                                    key={plan._id}
                                    className={styles.iconText}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlanChange(channel._id, plan._id);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <span>{formatPlanType(plan)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* PRICE DETAILS */}
                        <div className={styles.planDetails}>
                          {channel.telegramPlan
                            .filter(
                              (p) =>
                                p._id === selectedPlans[channel._id]
                            )
                            .map((plan) => (
                              <div key={plan._id} className={styles.items}>
                                <div className={styles.contentAlignment}>
                                  <span>{formatPlanType(plan)}</span>
                                  <h4>${plan.price.toFixed(2)}</h4>
                                </div>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* BUTTON */}
                <div className={styles.btn}>
                  <Button
                    text="Join Now"
                    onClick={() =>
                      router.push(`/telegramDetails?id=${channel._id}`)
                    }
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
