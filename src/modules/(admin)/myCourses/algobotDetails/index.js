"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./algobotDetails.module.scss";
import Breadcumbs from "@/modules/(admin)/breadcumbs";
import Button from "@/compoents/button";
import Input from "@/compoents/input";
import Modal from "@/compoents/modal/Modal";
import { getCoupon, getOneBot, getPlan } from "@/compoents/api/algobot";
import OutlineButton from "@/compoents/outlineButton";
import toast from "react-hot-toast";
import { getPaymentUrl } from "@/compoents/api/dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { marked } from "marked";
import Dropdownarrow from "@/icons/dropdownarrow";
const RightIcon = "/assets/icons/right.svg";
const MinusIcon = "/assets/icons/minus.svg";
const PlusIcon = "/assets/icons/plus.svg";
const SuccessIcon = "/assets/icons/success.svg";
const ErrorIcon = "/assets/icons/error.svg";

function AlgobotDetails({ id }) {
  const [algobotData, setAlgobotData] = useState({});
  const [plans, setPlans] = useState([]);
  const [planQuantities, setPlanQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [couponId, setCouponId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [commonDiscount, setCommonDiscount] = useState(0); // 10% common discount
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const [availableLanguages, setAvailableLanguages] = useState([]);


  const handleLanguageChange = (index) => {
    setSelectedLanguageIndex(index);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownRef = useRef(null);
  const fetchAlgobotData = async () => {
    try {
      setIsLoading(true);
      const response = await getOneBot(id);
      setAlgobotData(response.payload);

      const plansResponse = await getPlan(id);
      const initialQuantities = {};
      plansResponse.payload?.forEach((plan) => {
        initialQuantities[plan._id] = 1; // Initialize quantity as 1 for each plan
      });
      setPlanQuantities(initialQuantities);
      setPlans(plansResponse.payload || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = (planId) => {
    setPlanQuantities((prev) => ({
      ...prev,
      [planId]: (prev[planId] || 1) + 1,
    }));
  };

  const handleDecrement = (planId) => {
    setPlanQuantities((prev) => {
      if (prev[planId] > 1) {
        return {
          ...prev,
          [planId]: prev[planId] - 1,
        };
      }
      return prev;
    });
  };

  const handleBuyNow = (plan) => {
    const quantity = planQuantities[plan._id] || 1;
    const originalPrice = plan.initialPrice * quantity;
    const commonDiscountAmount = (originalPrice * (plan.discount || 0)) / 100;
    const priceAfterCommonDiscount = originalPrice - commonDiscountAmount;

    setSelectedPlan({
      ...plan,
      originalPrice: originalPrice,
      totalPrice: priceAfterCommonDiscount,
      quantity: quantity,
      commonDiscount: plan.commonDiscount || 0,
      discountType: "common",
      priceAfterCommonDiscount: priceAfterCommonDiscount,
    });

    setCoupon("");
    setDiscount(commonDiscountAmount);
    setError("");
    setAppliedCoupon(null);
    setIsModalOpen(true);
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    try {
      setIsValidating(true);
      setError("");
      const response = await getCoupon(coupon);

      if (response.success && response.payload) {
        const couponDiscountPercentage = response.payload.discount || 0;
        const originalPrice = selectedPlan.originalPrice;

        const totaldiscount = selectedPlan.discount + couponDiscountPercentage;
        const discountAmount = (originalPrice * totaldiscount) / 100;
        const finalPrice = originalPrice - discountAmount;

        setCouponId(response.payload._id);
        setAppliedCoupon({
          code: coupon,
          discount: couponDiscountPercentage,
        });

        setSelectedPlan((prev) => ({
          ...prev,
          totalPrice: finalPrice,
          discountType: "combined",
          couponDiscount: couponDiscountPercentage,
          commonDiscount: selectedPlan.discount,
          couponDiscountPercentage: couponDiscountPercentage,
        }));

        toast.success("Coupon applied successfully!");
      } else {
        setError(response.messages || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setError("Failed to validate coupon. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };
  console.log("🚀 ~ plans:", plans)

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    try {
      setIsProcessingPayment(true);
      setError("");

      const orderData = {
        strategyPlanId: selectedPlan._id,
        botId: algobotData?._id,
        couponId: couponId || undefined,
        noOfBots: planQuantities[selectedPlan._id] || 1,
        success_url: window.location.href,
        cancel_url: window.location.href,
      };

      const response = await getPaymentUrl(orderData);
      if (response.success) {
        router.replace(response?.payload?.data?.checkout_url);
        setIsModalOpen(false);
      } else {
        setError(response.message || "Failed to process payment");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    fetchAlgobotData();
  }, []);

  useEffect(() => {
    if (algobotData?.link?.length > 0) {
      setAvailableLanguages(algobotData.link);
      setSelectedLanguageIndex(0); // Reset to first language when data changes
    }
  }, [algobotData]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId =
        urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch (e) {
      console.error("Invalid YouTube URL:", url);
      return "";
    }
  };

  const renderSkeletonCards = (count = 3) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div className={styles.planGridItems} key={`skeleton-${index}`}>
          <Skeleton width="100%" height={24} />
          <div className={styles.cardHeaderAlignment}></div>
          <div className={styles.childBox}>
            <Skeleton width="100%" height="56px" />
          </div>
          <div className={styles.counterAlignment}>
            <Skeleton width="30px" height="30px" />
            <Skeleton width="30px" height="30px" />
            <Skeleton width="30px" height="30px" />
          </div>
          <Skeleton width="143px" height="52px" />
        </div>
      ));
  };

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

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    const modalContent =
      paymentStatus === "success" ? (
        <div className={styles.paymentModalContent}>
          <img src={SuccessIcon} alt="Success" className={styles.paymentIcon} />
          <h3>Payment Successful!</h3>
          <p>
            Thank you for your purchase. Please check your email for the
            download link.
          </p>
        </div>
      ) : (
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
                handlePurchase();
              }}
            />
            <Button
              text="Close"
              onClick={() => setShowPaymentModal(false)}
              style={{ marginLeft: "10px" }}
            />
          </div>
        </div>
      );

    return (
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      >
        {modalContent}
      </Modal>
    );
  };

  return (
    <div>
      {renderPaymentModal()}
      <Breadcumbs />
      <div className={styles.algobotDetailsAlignment}>
        {isLoading ? (
          <>
            <div className={styles.pageHeaderAlignment}>
              <div className={styles.text}>
                <Skeleton width="100%" height="35px" />
              </div>
            </div>
            <div className={styles.algobanner}>
              <div className={styles.twocolgrid}>
                <Skeleton width="100%" height="440px" />
                <Skeleton width="100%" height="440px" />
              </div>
            </div>
            <div className={styles.tutorial}>
              <Skeleton width="75px" height="25px" />
              <div className={styles.textdropdown}>
                <Skeleton width="250px" height="28px" />
                <Skeleton width="120px" height="22px" />
              </div>
            </div>
            <div className={styles.tutorialVideo}>
              <div className={styles.subBox}>
                <Skeleton width="100%" height="540px" />
              </div>
            </div>
            <div className={styles.coursePlan}>
              <div className={styles.sbutitle}>
                <Skeleton width="100%" height="25px" />
              </div>
              <div className={styles.planGrid}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.planGridItems}>
                    <Skeleton width="100%" height={24} />
                    <div className={styles.cardHeaderAlignment}></div>
                    <div className={styles.childBox}>
                      <Skeleton width="100%" height="56px" />
                    </div>
                    <div className={styles.counterAlignment}>
                      <Skeleton width="30px" height="30px" />
                      <Skeleton width="30px" height="30px" />
                      <Skeleton width="30px" height="30px" />
                    </div>
                    <Skeleton width="143px" height="52px" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.pageHeaderAlignment}>
              <div className={styles.text}>
                <h2>{algobotData?.title}</h2>


                {/* purchsed date expiry date */}
              </div>
            </div>
            <div className={styles.algobanner}>
              <div className={styles.grid}>
                <div className={styles.griditems}>
                  <div className={styles.box}>
                    {algobotData?.imageUrl && (
                      <img
                        src={algobotData.imageUrl}
                        alt={algobotData.title}
                        className={styles.algobotImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/path/to/placeholder-image.jpg";
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.griditems}>
                  <p
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: marked(algobotData.description || ""),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.tutorial} ref={dropdownRef}>
              <h3>Tutorial</h3>
              <div className={styles.textdropdown}>
                <p>Select your preferred language :</p>
                <div className={styles.dropdownmain}>
                  {/* Dropdown Head */}
                  <div
                    className={styles.dropdownhead}
                    onClick={() => setIsOpen((prev) => !prev)}
                  >
                    <span>
                      {availableLanguages.length > 0
                        ? availableLanguages[selectedLanguageIndex]?.language
                        : "No languages available"}
                    </span>
                    <div className={styles.dropdownarrow}>
                      <Dropdownarrow />
                    </div>
                  </div>

                  {/* Dropdown List */}
                  {isOpen && availableLanguages.length > 0 && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownspacing}>
                        {availableLanguages.map((lang, index) => (
                          <div
                            key={lang._id || index}
                            className={styles.iconText}
                            onClick={() => handleLanguageChange(index)}
                          >
                            <span>{lang.language}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.tutorialVideo}>
              <div className={styles.subBox}>
                {availableLanguages[selectedLanguageIndex]?.url && (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(
                      availableLanguages[selectedLanguageIndex].url
                    )}
                    title={`Tutorial Video - ${availableLanguages[selectedLanguageIndex]?.language || ""
                      }`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: "16px" }}
                  ></iframe>
                )}
              </div>
            </div>
            <div className={styles.coursePlan}>
              <div className={styles.sbutitle}>
                <h2>Bot Plans</h2>
              </div>
              <div className={styles.planGrid}>
                {isLoading ? (
                  // renderSkeletonCards()
                  <></>
                ) : plans?.length > 0 ? (
                  plans.map((plan, index) => (
                    <div
                      className={styles.planGridItems}
                      key={plan._id || index}
                    >
                      <div className={styles.cardHeaderAlignment}>
                        <h3>{plan.planType}</h3>
                        <h4>
                          $
                          {(
                            plan.price * (planQuantities[plan._id] || 1)
                          ).toFixed(2)}
                        </h4>
                      </div>
                      <div className={styles.childBox}>
                        <div className={styles.contentAlignment}>
                          <span>M.R.P :</span>
                          <span>${plan.initialPrice}</span>
                        </div>
                        <div className={styles.contentAlignment}>
                          <span>Discount :</span>
                          <span className={styles.redText}>
                            {plan.discount > 0 ? `-${plan.discount}%` : "0%"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.counterAlignment}>
                        <div
                          className={`${styles.icons} ${(planQuantities[plan._id] || 1) <= 1
                            ? styles.disabled
                            : ""
                            }`}
                          onClick={() => handleDecrement(plan._id)}
                        >
                          <img src={MinusIcon} alt="Decrease quantity" />
                        </div>
                        <div className={styles.textDesign}>
                          <span>{planQuantities[plan._id] || 1}</span>
                        </div>
                        <div
                          className={styles.icons}
                          onClick={() => handleIncrement(plan._id)}
                        >
                          <img src={PlusIcon} alt="Increase quantity" />
                        </div>
                      </div>
                      <Button
                        text="Buy Now"
                        icon={RightIcon}
                        onClick={() => handleBuyNow(plan)}
                      />
                    </div>
                  ))
                ) : (
                  <p>No plans available</p>
                )}
              </div>
            </div>


            <div className={styles.paymenyhistorytable}>
              <div className={styles.sbutitle}>
                <h2>Purchased Bots</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Meta Account No.</th>

                    <th>Plan</th>
                    <th>Purchased Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {plans
                    .flatMap(plan =>
                      plan.payment?.map((payment, index) => ({
                        ...payment,
                        planType: payment.planType || plan.planType
                      })) || []
                    )
                    .map((payment, index) => (
                      <tr key={`${payment._id}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{payment.metaAccountNo?.join(', ') || 'N/A'}</td>
                        <td>{payment.planType}</td>

                        <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                        <td>{payment.startDate ? new Date(payment.startDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                        <td>{payment.endDate ? new Date(payment.endDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

          </>
        )}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Complete Your Purchase"
        className={styles.modal}
      >
        {selectedPlan && (
          <div className={styles.modalContent}>
            <div className={styles.planInfo}>
              <h3>{selectedPlan.planType} Plan</h3>
              <p>
                <span>Quantity:</span>
                <span>{selectedPlan.quantity || 1}</span>
              </p>
              <p>
                <span>Price per unit:</span>
                <span>${selectedPlan.initialPrice}</span>
              </p>
              <p>
                <span>Subtotal:</span>
                <span>${selectedPlan.originalPrice.toFixed(2)}</span>
              </p>

              {selectedPlan.discountType === "combined" ? (
                <>
                  <p className={styles.discountText}>
                    <span>
                      Common Discount ({selectedPlan.commonDiscount}%):
                    </span>
                    <span>
                      -$
                      {(
                        (selectedPlan.originalPrice *
                          selectedPlan.commonDiscount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </p>
                  <p className={styles.discountText}>
                    <span>Coupon Discount ({appliedCoupon?.discount}%):</span>
                    {/* <span>-${((selectedPlan.originalPrice - (selectedPlan.originalPrice * selectedPlan.commonDiscount / 100)) * (appliedCoupon?.discount / 100)).toFixed(2)}</span> */}
                    <span>
                      -$
                      {(
                        (appliedCoupon?.discount * selectedPlan.originalPrice) /
                        100
                      ).toFixed(2)}
                    </span>
                  </p>
                </>
              ) : selectedPlan.discountType === "coupon" ? (
                <p className={styles.discountText}>
                  <span>Coupon Discount ({appliedCoupon?.discount}%):</span>
                  <span>
                    -$
                    {(
                      selectedPlan.originalPrice *
                      (appliedCoupon?.discount / 100)
                    ).toFixed(2)}
                  </span>
                </p>
              ) : (
                <p className={styles.discountText}>
                  <span>Common Discount ({selectedPlan.discount}%):</span>
                  <span>
                    -$
                    {(
                      (selectedPlan.originalPrice * selectedPlan.discount) /
                      100
                    ).toFixed(2)}
                  </span>
                </p>
              )}

              <h4 className={styles.totalPrice}>
                <span>Total Amount:</span>
                <span>${selectedPlan.totalPrice.toFixed(2)}</span>
              </h4>
            </div>

            <div className={styles.couponSection}>
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={appliedCoupon !== null}
                className={styles.couponInput}
              />
              <OutlineButton
                text={appliedCoupon ? "Applied" : "Apply"}
                onClick={handleApplyCoupon}
                disabled={isValidating || appliedCoupon !== null || isLoading}
                isLoading={isValidating}
                variant={appliedCoupon ? "secondary" : "primary"}
              />
            </div>

            {appliedCoupon && (
              <p className={styles.successText}>
                Coupon {appliedCoupon.code} applied successfully! (
                {appliedCoupon.discount}% off)
              </p>
            )}
            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.modalActions}>
              <Button
                text="Cancel"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              />
              <Button
                onClick={handlePurchase}
                disabled={isProcessingPayment || isLoading}
                text={
                  isProcessingPayment
                    ? "Processing..."
                    : `Pay $${selectedPlan.totalPrice.toFixed(2)}`
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AlgobotDetails;
