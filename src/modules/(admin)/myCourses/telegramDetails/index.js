"use client";
import React, { useEffect, useState } from "react";
import styles from "./telegramDetails.module.scss";
import Breadcumbs from "@/modules/(admin)/breadcumbs";
import Button from "@/compoents/button";
import Input from "@/compoents/input";
import Modal from "@/compoents/modal/Modal";
import { getCoupon, getOneBot, getPlan } from "@/compoents/api/algobot";
import OutlineButton from "@/compoents/outlineButton";
import toast from "react-hot-toast";
import { getPaymentUrl, getTelegramChannels } from "@/compoents/api/dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const RightIcon = "/assets/icons/right.svg";
const MinusIcon = "/assets/icons/minus.svg";
const PlusIcon = "/assets/icons/plus.svg";
const SuccessIcon = "/assets/icons/success.svg";
const ErrorIcon = "/assets/icons/error.svg";

function TelegramDetails({ id }) {
    const [telegramData, setTelegramData] = useState({});
    const [plans, setPlans] = useState([]);
    const [hasPurchasedPlan, setHasPurchasedPlan] = useState(false);
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
    const [commonDiscount, setCommonDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [telegramId, setTelegramId] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);


    const handleLanguageChange = (e) => {
        setSelectedLanguageIndex(Number(e.target.value));
    };

    const fetchTelegramData = async () => {
        try {
            setIsLoading(true);
            const response = await getTelegramChannels(id);
            setTelegramData(response.payload.data[0]);
            const telegramPlans = response.payload.data[0].telegramPlan || [];
            setPlans(telegramPlans);
            // Check if any plan has isPayment: true
            setHasPurchasedPlan(telegramPlans.some(plan => plan.isPayment));
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
        const quantity = 1; // Since we're not using quantity in Telegram
        const originalPrice = plan.initialPrice * quantity;
        const commonDiscountAmount = (originalPrice * (plan.discount || 0)) / 100;
        const priceAfterCommonDiscount = originalPrice - commonDiscountAmount;

        setSelectedPlan({
            ...plan,
            originalPrice: originalPrice,
            totalPrice: priceAfterCommonDiscount,
            quantity: quantity,
            commonDiscount: plan.discount || 0,
            discountType: 'common',
            priceAfterCommonDiscount: priceAfterCommonDiscount
        });

        setTelegramId('');
        setCoupon('');
        setDiscount(commonDiscountAmount);
        setError('');
        setAppliedCoupon(null);
        setIsModalOpen(true);
    };

    const handleApplyCoupon = async () => {
        if (!coupon.trim() || !selectedPlan) return;

        try {
            setIsValidating(true);
            setError('');

            const response = await getCoupon(coupon);

            if (response.success) {
                const couponDiscountPercentage = response.payload.discount;
                const couponDiscountAmount = (selectedPlan.originalPrice * couponDiscountPercentage) / 100;
                const totalDiscount = (((selectedPlan.commonDiscount * selectedPlan.originalPrice) / 100) || 0) + couponDiscountAmount;
                const finalPrice = selectedPlan.originalPrice - totalDiscount;

                setCouponId(response.payload._id);
                setAppliedCoupon({
                    code: coupon,
                    discount: couponDiscountPercentage
                });

                setSelectedPlan(prev => ({
                    ...prev,
                    totalPrice: finalPrice,
                    discountType: 'combined',
                    couponDiscount: couponDiscountPercentage,
                    commonDiscount: prev.commonDiscount || 0
                }));

                toast.success('Coupon applied successfully!');
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
        if (!selectedPlan || !telegramId.trim()) {
            setError(telegramId.trim() ? 'Please enter your Telegram ID' : 'Please enter your Telegram ID');
            return;
        }

        try {
            setIsProcessingPayment(true);
            setError('');

            const orderData = {
                telegramPlanId: selectedPlan._id,
                telegramAccountNo: telegramId.trim(),
                couponId: couponId || undefined,
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



    useEffect(() => {
        fetchTelegramData();
    }, []);



    const getYouTubeEmbedUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        } catch (e) {
            console.error('Invalid YouTube URL:', url);
            return '';
        }
    };

    const calculateEndDate = (startDate, durationMonths) => {
        if (!startDate || !durationMonths) return 'N/A';
        
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + parseInt(durationMonths));
        
        // Format date in 'DD/MM/YYYY' format to match other dates
        return date.toLocaleDateString('en-GB');
    };

    const renderSkeletonCards = (count = 3) => {
        return Array(count).fill(0).map((_, index) => (
            <div className={styles.planCard} key={`skeleton-${index}`}>
                <Skeleton width="100%" height={24} />
                <div className={styles.cardHeaderAlignment}>
                </div>
                <div className={styles.childBox}>
                    <Skeleton width="100%" height="56px" />
                </div>
                <Skeleton width="143px" height="52px" />
            </div>
        ));
    };

    const renderPlanCards = () => {
        if (isLoading) {
            return renderSkeletonCards(3);
        }

        // Check if any plan is purchased
        const hasPurchasedPlan = plans.some(plan => plan.isPayment);

        return (
            <div className={styles.planGrid}>
                {plans.map((plan) => {
                    const isPurchased = plan.isPayment;
                    const isDisabled = hasPurchasedPlan && !isPurchased; // Disable if any plan is purchased and this one isn't

                    return (
                        <div
                            key={plan._id}
                            className={`${styles.planGridItems}`}
                        >

                            <div className={styles.cardHeaderAlignment}>
                                <h3>{plan.planType}</h3>
                                <h4>${plan.price.toFixed(2)}</h4>
                            </div>
                            <div className={styles.childBox}>
                                <div className={styles.contentAlignment}>
                                    <span>M.R.P:</span>
                                    <span>${plan.initialPrice.toFixed(2)}</span>
                                </div>
                                <div className={styles.contentAlignment}>
                                    <span>Discount:</span>
                                    <span className={styles.dangerText}>
                                        {plan.discount || 0}% OFF
                                    </span>
                                </div>
                            </div>
                            <div className={styles.buttonAlignment}>

                                <Button
                                    text="Subscribe Now"
                                    onClick={() => handleBuyNow(plan)}
                                />

                            </div>
                        </div>
                    );
                })}
            </div>
        );
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
                <div className={styles.paymentModaltitlecontent}>
                    <img src={SuccessIcon} alt="Success" className={styles.paymentIcon} />
                    <h3>Payment Successful!</h3>
                    <p>Thank you for your purchase. Please check your email for the download link.</p>
                </div>
            </div>
        ) : (
            <div className={styles.paymentModalContent}>
                <div className={styles.paymentModaltitlecontent}>
                    <img src={ErrorIcon} alt="Cancelled" className={styles.paymentIcon} />
                    <h3>Payment Cancelled</h3>
                    <p>Your payment was not completed. Please try again to purchase.</p>
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
        <div className={styles.telegramDetails}>
            {renderPaymentModal()}
            <Breadcumbs />
            {/* Header Section */}
            <div className={styles.telegramDetailsContainer}>
                <div className={styles.telegramDetailstitle}>
                    <h1>{telegramData?.channelName || <Skeleton width="100%" height={24} />}</h1>
                    <p>{telegramData?.description || <Skeleton width="100%" height={24} count={2} />}</p>
                </div>

                {/* Plans Section */}
                <div className={styles.plansSection}>
                    <div className={styles.plansTitle}>
                        <h2>Available Plans</h2>
                    </div>
                    {renderPlanCards()}
                </div>

                <div className={styles.paymenyhistorytable}>
                    <div className={styles.sbutitle}>
                        <h2>Subscribed channels</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>User TelegramId</th>

                                <th>Plan</th>
                              
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
                                        <td>{payment.telegramAccountNo || 'N/A'}</td>
                                        <td>{payment.planType}</td>
                                        <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                                        <td>{calculateEndDate(payment.createdAt, payment.planType)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {/* Purchase Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Complete Your Subscription"
                >
                    {selectedPlan && (
                        <div className={styles.modalContent}>
                            <div className={styles.telegramIdSection}>
                                <Input
                                    type="text"
                                    placeholder="Enter your Telegram ID"
                                    value={telegramId}
                                    onChange={(e) => setTelegramId(e.target.value)}
                                    className={styles.couponInput}
                                    required
                                />
                            </div>
                            <div className={styles.planInfo}>
                                <h3>{selectedPlan.planType} Plan</h3>
                                <p>
                                    <span>Original Price:</span>
                                    <span>${selectedPlan.originalPrice?.toFixed(2) || '0.00'}</span>
                                </p>

                                {selectedPlan.commonDiscount > 0 && (
                                    <p className={styles.discountText}>
                                        <span>Common Discount ({selectedPlan.commonDiscount}%):</span>
                                        <span>-${((selectedPlan.originalPrice * selectedPlan.commonDiscount) / 100).toFixed(2)}</span>
                                    </p>
                                )}

                                {appliedCoupon && (
                                    <p className={styles.discountText}>
                                        <span>Coupon Discount ({appliedCoupon.discount}%):</span>
                                        <span>-${((selectedPlan.originalPrice) * (appliedCoupon.discount / 100)).toFixed(2)}</span>
                                    </p>
                                )}

                                <h4 className={styles.totalPrice}>
                                    <span>Total Amount:</span>
                                    <span>${selectedPlan.totalPrice?.toFixed(2) || '0.00'}</span>
                                </h4>
                            </div>



                            <div className={styles.couponSection}>
                                <Input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    disabled={!!appliedCoupon}
                                    className={styles.couponInput}
                                />
                                <OutlineButton
                                    text={appliedCoupon ? 'Applied' : 'Apply'}
                                    onClick={handleApplyCoupon}
                                    disabled={isValidating || !!appliedCoupon || !coupon.trim()}
                                    isLoading={isValidating}
                                    variant={appliedCoupon ? 'secondary' : 'primary'}
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
                                    text={`Pay $${selectedPlan.totalPrice?.toFixed(2) || '0.00'}`}
                                    onClick={handlePurchase}
                                    disabled={isProcessingPayment}
                                    isLoading={isProcessingPayment}
                                />
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default TelegramDetails;
