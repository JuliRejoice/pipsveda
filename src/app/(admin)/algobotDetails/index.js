"use client";
import React, { useEffect, useState } from "react";
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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [couponId, setCouponId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [commonDiscount, setCommonDiscount] = useState(10); // 10% common discount
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchAlgobotData = async () => {
    try {
      setIsLoading(true);
      const response = await getOneBot(id);
      setAlgobotData(response.payload);

      const plansResponse = await getPlan(id);
      const initialQuantities = {};
      plansResponse.payload?.forEach(plan => {
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
    setPlanQuantities(prev => ({
      ...prev,
      [planId]: (prev[planId] || 1) + 1
    }));
  };

  const handleDecrement = (planId) => {
    setPlanQuantities(prev => {
      if (prev[planId] > 1) {
        return {
          ...prev,
          [planId]: prev[planId] - 1
        };
      }
      return prev;
    });
  };

  const handleBuyNow = (plan) => {
    const quantity = planQuantities[plan._id] || 1;
    const originalPrice = plan.initialPrice * quantity;
    const commonDiscountAmount = (originalPrice * commonDiscount) / 100;
    console.log(originalPrice)
    setSelectedPlan({
      ...plan,
      originalPrice: originalPrice,
      totalPrice: originalPrice - commonDiscountAmount, // Apply common discount by default
      quantity: quantity,
      commonDiscount: commonDiscountAmount,
      discountType: 'common'
    });
    setCoupon('');
    setDiscount(commonDiscountAmount);
    setError('');
    setAppliedCoupon(null);
    setIsModalOpen(true);
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setIsValidating(true);
      setError('');
      const response = await getCoupon(coupon);

      if (response.success && response.payload) {
        const discountPercentage = response.payload.discount || 0;
        const originalTotal = selectedPlan.originalPrice;
        const discountAmount = (originalTotal * discountPercentage) / 100;
        
        setDiscount(discountAmount);
        setCouponId(response.payload._id);
        setAppliedCoupon({
          code: coupon,
          discount: discountPercentage
        });
        
        toast.success('Coupon applied successfully!');
        
        setSelectedPlan(prev => ({
          ...prev,
          totalPrice: Math.max(0, originalTotal - discountAmount),
          discountType: 'coupon',
          couponDiscount: discountAmount
        }));
      } else {
        setError(response.messages || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError('Failed to validate coupon. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    try {
      setIsProcessingPayment(true);
      setError('');
      
      const orderData = {
        strategyPlanId: selectedPlan._id,
        botId: algobotData?._id,
        couponId: couponId || undefined,
        noOfBots: planQuantities[selectedPlan._id] || 1,
        success_url: window.location.href,
        cancel_url: window.location.href
      };

      const response = await getPaymentUrl(orderData);
      if (response.success) {
        router.replace(response?.payload?.data?.checkout_url);
        setIsModalOpen(false);
      } else {
        setError(response.message || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    return (selectedPlan.price * (planQuantities[selectedPlan._id] || 1)) - discount;
  };

  useEffect(() => {
    fetchAlgobotData();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    try {
      let videoId = "";
  
      // Case 1: Standard YouTube watch link
      if (url.includes("watch?v=")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      } 
      
      // Case 2: Short youtu.be link
      else if (url.includes("youtu.be")) {
        const urlObj = new URL(url);
        videoId = urlObj.pathname.slice(1); // remove leading "/"
      }
  
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      return null;
    }
  };

  const renderSkeletonCards = (count = 3) => {
    return Array(count).fill(0).map((_, index) => (
      <div className={styles.planGridItems} key={`skeleton-${index}`}>
        <div className={styles.cardHeaderAlignment}>
          <h3><Skeleton width={120} height={24} /></h3>
          <h4><Skeleton width={80} height={28} /></h4>
        </div>
        <div className={styles.childBox}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div className={styles.contentAlignment} key={`skeleton-content-${item}`}>
              <span><Skeleton width={80} /></span>
              <span><Skeleton width={60} /></span>
            </div>
          ))}
          <div className={styles.buttonAlignment}>
            <Skeleton height={40} width={120} />
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    const isPayment = searchParams.get('isPayment');
    if (isPayment) {
      setPaymentStatus(isPayment === 'true' ? 'success' : 'cancelled');
      setShowPaymentModal(true);
      // Clean up URL without refreshing the page
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('isPayment');
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;

    const modalContent = paymentStatus === 'success' ? (
      <div className={styles.paymentModalContent}>
        <img src={SuccessIcon} alt="Success" className={styles.paymentIcon} />
        <h3>Payment Successful!</h3>
        <p>Thank you for your purchase. Please check your email for the download link.</p>
      </div>
    ) : (
      <div className={styles.paymentModalContent}>
        <img src={ErrorIcon} alt="Cancelled" className={styles.paymentIcon} />
        <h3>Payment Cancelled</h3>
        <p>Your payment was not completed. Please try again to purchase.</p>
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
            style={{ marginLeft: '10px' }}
          />
        </div>
      </div>
    );

    return (
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        {modalContent}
      </Modal>
    );
  };

  return (
    <div>
      {renderPaymentModal()}
      <Breadcumbs />
      <div className={styles.algobotDetailsAlignment}>
        <div className={styles.pageHeaderAlignment}>
          <div className={styles.text}>
            <h2>{algobotData?.title}</h2>
          </div>
        </div>
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
                    e.target.src = '/path/to/placeholder-image.jpg';
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.griditems}>
            <p>{algobotData?.description}</p>
          </div>
        </div>
        <div className={styles.tutorial}>
          <h3>Tutorial</h3>
          <div className={styles.textdropdown}>
            <p>Select your preferred language :</p>
            <select>
              {algobotData?.link?.length > 0 ? (
                algobotData.link.map((link, index) => (
                  <option key={index}>{link.language}</option>
                ))
              ) : (
                <option>English</option>
              )}
            </select>
          </div>
        </div>

        <div className={styles.tutorialVideo}>
          <div className={styles.subBox}>
            {algobotData?.link?.[0]?.url && (
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(algobotData.link[0].url)}
                title="Tutorial Video"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '16px' }}
              ></iframe>
            )}
          </div>
        </div>
        <div className={styles.coursePlan}>
          <div className={styles.sbutitle}>
            <h2>Course Plans</h2>
          </div>
          <div className={styles.planGrid}>
            {isLoading ? (
              renderSkeletonCards()
            ) : plans?.length > 0 ? (
              plans.map((plan, index) => (
                <div className={styles.planGridItems} key={plan._id || index}>
                  <div className={styles.cardHeaderAlignment}>
                    <h3>{plan.planType}</h3>
                    <h4>${(plan.price * (planQuantities[plan._id] || 1)).toFixed(2)}</h4>
                  </div>
                  <div className={styles.childBox}>
                    <div className={styles.contentAlignment}>
                      <span>M.R.P :</span>
                      <span>${plan.initialPrice}</span>
                    </div>
                    <div className={styles.contentAlignment}>
                      <span>Discount :</span>
                      <span className={styles.redText}>
                        {plan.discount > 0 ? `-${plan.discount}%` : '0%'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.counterAlignment}>
                    <div
                      className={`${styles.icons} ${(planQuantities[plan._id] || 1) <= 1 ? styles.disabled : ''}`}
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
                <span>${(selectedPlan.initialPrice)}</span>
              </p>
              <p>
                <span>Subtotal:</span>
                <span>${selectedPlan.originalPrice.toFixed(2)}</span>
              </p>
              
              {/* Show discount details */}
              {selectedPlan.discountType === 'coupon' ? (
                <p className={styles.discountText}>
                  <span>Coupon Discount ({appliedCoupon?.discount}%):</span>
                  <span>-${selectedPlan.couponDiscount?.toFixed(2) || '0.00'}</span>
                </p>
              ) : (
                <p className={styles.discountText}>
                  <span>Common Discount ({commonDiscount}%):</span>
                  <span>-${selectedPlan.commonDiscount?.toFixed(2) || '0.00'}</span>
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
                text={appliedCoupon ? 'Applied' : 'Apply'}
                onClick={handleApplyCoupon}
                disabled={isValidating || appliedCoupon !== null || isLoading}
                isLoading={isValidating}
                variant={appliedCoupon ? 'secondary' : 'primary'}
              />
            </div>

            {appliedCoupon && (
              <p className={styles.successText}>
                Coupon {appliedCoupon.code} applied successfully! ({appliedCoupon.discount}% off)
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
                    ? 'Processing...' 
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
