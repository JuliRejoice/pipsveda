"use client";
import React, { useEffect, useState } from "react";
import styles from "./telegramChannels.module.scss";
import OutlineButton from "@/compoents/outlineButton";
import Pagination from "@/compoents/pagination";
import { getAlgobot } from "@/compoents/api/algobot";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getTelegramChannels } from "@/compoents/api/dashboard";
import Button from "@/compoents/button";
import Dropdownarrow from "@/icons/dropdownarrow";

const RightBlackIcon = "/assets/icons/right-black.svg";
const CardImage = "/assets/images/crypto.png";
const RightIcon = "/assets/icons/right.svg";

// Skeleton component to match the card layout
const CardSkeleton = () => (
   <div
    style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      width: "500px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    {/* Title */}
    <Skeleton width="60%" height={24} />

    {/* Description */}
    <Skeleton count={2} height={12} />

    {/* Dropdown Placeholder */}
    <Skeleton height={40} width="60%" style={{ borderRadius: "8px" }} />

    {/* Pricing Box */}
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "12px",
        marginTop: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </div>
    </div>

    {/* Button Placeholder */}
    <Skeleton height={45} width="60%" style={{ borderRadius: "24px", margin: "0 auto" }} />
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className={styles.emptyState}>
    <img
      src="/assets/icons/no-course.svg"
      alt="No channels"
      className={styles.emptyImage}
    />
    <h3>No Telegram Channels Available</h3>
    <p>
      There are no Telegram channels to display at the moment. Please check back
      later or try a different search.
    </p>
  </div>
);

export default function TelegramChannels({
  channels,
  setChannels,
  searchQuery,
  setSearchQuery,
  loading,
  setLoading,
  error,
  setError,
  selectedChannel,
  setSelectedChannel,
}) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedPlans, setSelectedPlans] = useState({});

  // Add this effect to initialize selected plans
  useEffect(() => {
    if (channels && channels.length > 0) {
      const initialSelectedPlans = {};
      channels.forEach((channel) => {
        if (channel.telegramPlan?.length > 0) {
          initialSelectedPlans[channel._id] = channel.telegramPlan[0]?._id;
        }
      });
      setSelectedPlans(initialSelectedPlans);
    }
  }, [channels]);

  const handlePlanChange = (channelId, planId) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [channelId]: planId,
    }));
  };

  useEffect(() => {
    const fetchTelegramChannelsData = async () => {
      try {
        setLoading(true);
        const response = await getTelegramChannels("", searchQuery);
        setChannels(response?.payload?.data || []);
      } catch (error) {
        console.error("Error fetching Telegram channels:", error);
        setError("Failed to load Telegram channels");
      } finally {
        setLoading(false);
      }
    };
    fetchTelegramChannelsData();
  }, [searchQuery]);

  // Show skeleton loading while data is being fetched
  if (loading) {
    return (
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
    );
  }

  // Show empty state if no channels are found
  if (!loading && (!channels || channels.length === 0)) {
    return (
      <div className={styles.arbitrageAlgoAlignment}>
        <div className={styles.title}>
          <h2>Telegram Channels</h2>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={styles.arbitrageAlgoAlignment}>
      <div className={styles.algotabsmain}>
        <div className={styles.title}>
          <h2>Telegram Channels</h2>
        </div>
      </div>
      <div className={styles.grid}>
        {channels?.map((channel) => (
          <div className={styles.griditems} key={channel._id}>
            {/* <div className={styles.image}>
                            <img
                                src={channel.imageUrl || '/assets/images/crypto.png'}
                                alt={channel.channelName}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/crypto.png';
                                }}
                            />
                        </div> */}
            <div className={styles.details}>
              <h3>{channel.channelName}</h3>
              <p>{channel.description}</p>
              <div className={styles.planslider}>
                <div className={styles.twoColgrid}>
                  {channel.telegramPlan?.length > 0 && (
                    <div className={styles.planDropdownContainer}>
                      <div className={styles.dropdownmain}>
                        <div
                          className={styles.dropdownhead}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === channel._id ? null : channel._id
                            )
                          }
                        >
                          <span>
                            {channel.telegramPlan.find(
                              (plan) =>
                                plan._id ===
                                (selectedPlans[channel._id] ||
                                  channel.telegramPlan[0]?._id)
                            )?.planType || "Select a plan"}
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
                                  onClick={() => {
                                    handlePlanChange(channel._id, plan._id);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <span>{plan.planType}</span>
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
                                <span>Plan:</span>
                                <h4>{plan.planType}</h4>
                              </div>
                              <div className={styles.contentAlignment}>
                                <span>Price:</span>
                                <div className={styles.priceWrapper}>
                                  <h4 className={styles.priceAmount}>
                                    ${plan.price.toFixed(2)}
                                  </h4>
                                </div>
                              </div>
                              <div className={styles.contentAlignment}>
                                <span>M.R.P:</span>
                                <h5>${plan.initialPrice.toFixed(2)}</h5>
                              </div>
                              <div className={styles.contentAlignment}>
                                <span>Discount:</span>
                                <h5 className={styles.dangerText}>
                                  -{plan.discount || "0"}%
                                </h5>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {channel.telegramPlan?.some((plan) => plan.isPayment) ? (
                <Button
                  text={"Subscribed"}
                  onClick={() =>
                    router.push(`/my-courses/telegram/${channel._id}`)
                  }
                  icon={RightIcon}
                />
              ) : (
                <Button
                  text={"Join Channel"}
                  onClick={() => router.push(`/telegram/${channel._id}`)}
                  icon={RightIcon}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
