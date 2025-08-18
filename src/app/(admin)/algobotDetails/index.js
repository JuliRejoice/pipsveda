"use client";
import React, { useEffect, useState } from "react";
import styles from "./algobotDetails.module.scss";
import Breadcumbs from "@/modules/(admin)/breadcumbs";
import Button from "@/compoents/button";
import Input from "@/compoents/input";
import Modal from "@/compoents/modal/Modal";
import { getOneBot, getPlan } from "@/compoents/api/algobot";
import OutlineButton from "@/compoents/outlineButton";
const RightIcon = "/assets/icons/right.svg";
const MinusIcon = "/assets/icons/minus.svg";
const PlusIcon = "/assets/icons/plus.svg";

function AlgobotDetails({ id }) {
  const [algobotData, setAlgobotData] = useState({});
  const [plans, setPlans] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');


  const fetchAlgobotData = async () => {
    try {
      // Fetch algobot details
      const response = await getOneBot(id);
      setAlgobotData(response.payload);

      // Fetch plans for this algobot
      const plansResponse = await getPlan(id);
      console.log("plansResponse", plansResponse)
      setPlans(plansResponse.payload || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBuyNow = (plan) => {
    setSelectedPlan(plan);
    setCoupon('');
    setDiscount(0);
    setError('');
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
      // const response = await validateCoupon({
      //   couponCode: coupon,
      //   planId: selectedPlan.id,
      //   amount: selectedPlan.price * quantity
      // });

      // if (response.success) {
      //   setDiscount(response.discountAmount || 0);
      // } else {
      //   setError(response.message || 'Invalid coupon code');
      // }
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
      const orderData = {
        planId: selectedPlan._id, // Using _id from the API
        quantity,
        couponCode: coupon || undefined,
        totalAmount: (selectedPlan.price * quantity) - discount
      };

      // Uncomment and update when ready to implement
      // const response = await createOrder(orderData);
      // if (response.success) {
      //   alert('Order placed successfully!');
      //   setIsModalOpen(false);
      // } else {
      //   setError(response.message || 'Failed to place order');
      // }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    return (selectedPlan.price * quantity) - discount;
  };

  useEffect(() => {
    fetchAlgobotData();
  }, []);



  return (
    <div>
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
                src={algobotData.link[0].url.replace('watch?v=', 'embed/')}
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
            {plans.map((plan, index) => (
              <div className={styles.planGridItems} key={plan._id || index}>
                <div className={styles.cardHeaderAlignment}>
                  <h3>{plan.planType}</h3>
                  <h4>${plan.price}</h4>
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
                    className={`${styles.icons} ${quantity === 1 ? styles.disabled : ''}`}
                    onClick={handleDecrement}
                  >
                    <img src={MinusIcon} alt="Decrease quantity" />
                  </div>
                  <div className={styles.textDesign}>
                    <span>{quantity}</span>
                  </div>
                  <div
                    className={styles.icons}
                    onClick={handleIncrement}
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
            ))}
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
                <span>{quantity}</span>
              </p>
              <p>
                <span>Price per unit:</span>
                <span>${selectedPlan.price}</span>
              </p>
              {discount > 0 && (
                <p className={styles.discountText}>
                  <span>Discount:</span>
                  <span>-${discount}</span>
                </p>
              )}
              <h4>
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </h4>
            </div>

            <div className={styles.couponSection}>
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={discount > 0}
                className={styles.couponInput}
              />
              <OutlineButton
                text={discount > 0 ? 'Applied' : 'Apply'}
                onClick={handleApplyCoupon}
                disabled={isValidating || discount > 0}
                isLoading={isValidating}
                variant={discount > 0 ? 'secondary' : 'primary'}
              />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.modalActions}>
              <Button
                text="Cancel"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              />
              <Button
                text="Confirm Purchase"
                onClick={handlePurchase}
                isLoading={isValidating}
                variant="primary"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AlgobotDetails;
