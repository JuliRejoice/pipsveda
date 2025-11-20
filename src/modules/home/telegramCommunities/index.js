"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import styles from "./telegramCommunities.module.scss";
import ArrowVec from "@/icons/arrowVec";
import Button from "@/compoents/button";
import {
  getTelegramChannels,
  getTelegramFordashboard,
} from "@/compoents/api/dashboard";
import { useRouter } from "next/navigation";
import { getCookie } from "../../../../cookie";
import Dropdownarrow from "@/icons/dropdownarrow";

const ProfileImage = "/assets/images/profile-img.png";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function TelegramCommunities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [telegramChannels, setTelegramChannels] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  const fetchTelegramChannels = async () => {
  try {
    console.log("Fetching Telegram channels...");
    const response = await getTelegramFordashboard();
    console.log("API Response:", response); // Log the full response
    if (response && response.payload && Array.isArray(response.payload.data)) {
      console.log("Setting Telegram channels:", response.payload.data);
      setTelegramChannels(response.payload.data);
    } else {
      console.error("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  // Initialize selected plans when channels are loaded
  useEffect(() => {
    if (telegramChannels && telegramChannels.length > 0) {
      const initialSelectedPlans = {};
      telegramChannels.forEach((channel) => {
        if (channel.telegramPlan?.length > 0) {
          initialSelectedPlans[channel._id] = channel.telegramPlan[0]?._id;
        }
      });
      setSelectedPlans(initialSelectedPlans);
    }
  }, [telegramChannels]);

  const handlePlanChange = (channelId, planId) => {
    setSelectedPlans(prev => ({
      ...prev,
      [channelId]: planId
    }));
  };

  useEffect(() => {
    fetchTelegramChannels();
  }, []);

  const CARD_COUNT = 3;
  const [tilts, setTilts] = useState(
    Array.from({ length: CARD_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const [hovers, setHovers] = useState(
    Array.from({ length: CARD_COUNT }, () => false)
  );

  const handleMouseMove = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    const maxRotate = 10; // degrees
    const rotateY = (x / (rect.width / 2)) * maxRotate; // left/right
    const rotateX = (-y / (rect.height / 2)) * maxRotate; // top/bottom

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
  const getLowestMonthlyPrice = (plans = []) => {
    if (!plans?.length) return null;

    return plans.reduce((lowest, plan) => {
      const months = parseInt(plan.planType.replace(/\D/g, "")) || 1;
      const pricePerMonth = plan.price / months;
      return pricePerMonth < lowest ? pricePerMonth : lowest;
    }, Infinity);
  };

  return (
    <div className={styles.telegramCommunities}>
      <div className="container" ref={ref}>
        {/* Text Section Animation */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2>Join Private Telegram Communities</h2>
          <p>
            Connect with experts and peers for daily insights, trade setups, and
            support.
          </p>
        </motion.div>

        {/* Cards Animation */}
        <motion.div
          className={telegramChannels?.length > 2 ? styles.grid : styles.flex}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {telegramChannels?.length > 0 &&
            telegramChannels?.slice(0, 3).map((channel, i) => {
              const lowestMonthlyPrice = getLowestMonthlyPrice(
                channel.telegramPlan
              );
              return (
                <motion.div
                  className={styles.griditems}
                  key={channel._id}
                  variants={cardVariants}
                  style={{
                    transformPerspective: 1000,
                    willChange: "transform",
                    transformStyle: "preserve-3d",
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
                      : "0 6px 12px rgba(0,0,0,0.06)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                    mass: 0.6,
                  }}
                >
                  <div className={styles.cardImageContainer}>
                    {channel.image && (
                      <img 
                        src={channel.image} 
                        alt={channel.channelName}
                        className={styles.channelImage}
                        onError={(e) => {
                          console.log(e);
                          // e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {channel.logo && (
                      <div className={styles.logoContainer}>
                        <img 
                          src={channel.logo} 
                          alt={`${channel.channelName} logo`}
                          className={styles.channelLogo}
                          onError={(e) => {
                            console.log(e);
                            // e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.cardHeader}>
                    <div className={styles.textStyle}>
                      <h3>{channel.channelName}</h3>
                    </div>
                    <ArrowVec />
                  </div>

                  <div className={styles.listAlignment}>
                    <p>
                      {channel.description ||
                        "Join our community for updates and insights"}
                    </p>
                  </div>
                    <div className={styles.priceSection}>
                      <div className={styles.twoColgrid}>
                  {channel.telegramPlan?.length > 0 && (
                    <div className={styles.planDropdownContainer}>
                      <div className={styles.dropdownmain}>
                        <div
                          className={styles.dropdownhead}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === channel._id ? null : channel._id
                            );
                          }}
                        >
                          <span>
                            {channel.telegramPlan.find(
                              (plan) =>
                                plan._id ===
                                (selectedPlans[channel._id] ||
                                  channel.telegramPlan[0]?._id)
                            )?.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2') || "Select a plan"}
                          </span>
                          <div className={styles.dropdownarrow}>
                            <Dropdownarrow />
                          </div>
                        </div>

                        {openDropdown === channel._id && (
                          <div className={styles.dropdown}>
                            <div className={styles.dropdownspacing}>
                              {channel.telegramPlan.map((plan) => (
                                <div
                                  key={plan._id}
                                  className={styles.iconText}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlanChange(channel._id, plan._id);
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
                        {channel.telegramPlan
                          .filter(
                            (plan) =>
                              plan._id ===
                              (selectedPlans[channel._id] ||
                                channel.telegramPlan[0]?._id)
                          )
                          .map((plan) => (
                            <div key={plan._id} className={styles.items}>
                              <div className={styles.contentAlignment}>
                                <span>{plan.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2')}</span>
                                <h4> ${plan.price.toFixed(2)}</h4>
                              </div>
                              {/* <div className={styles.contentAlignment}>
                                <span>Price:</span>
                                <div className={styles.priceWrapper}>
                                  <h4 className={styles.priceAmount}>
                                    ${plan.price.toFixed(2)}
                                  </h4>
                                </div>
                              </div> */}
                              
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                  {/* {lowestMonthlyPrice && (
                      <div className={styles.priceContainer}>
                        <span className={styles.price}>
                          ${lowestMonthlyPrice.toFixed(2)}
                        </span>
                        <span className={styles.priceLabel}>/month</span>
                      </div>
                  )} */}
                    </div>

                  <div className={styles.btn}>
                    <Button
                      text={"Join Now"}
                      onClick={() =>
                        router.push(`/telegramDetails?id=${channel._id}`)
                      }
                    />
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </div>
    </div>
  );
}
