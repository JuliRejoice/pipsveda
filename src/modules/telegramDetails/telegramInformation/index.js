"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./telegramInformation.module.scss";
import Button from "@/compoents/button";
import Input from "@/compoents/input";
import Modal from "@/compoents/modal/Modal";
import { getCoupon, getOneBot, getPlan } from "@/compoents/api/algobot";
import OutlineButton from "@/compoents/outlineButton";
import toast from "react-hot-toast";
import { getPaymentUrl, getTelegramChannels, getTelegramFordashboard } from "@/compoents/api/dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getCookie } from "../../../../cookie";
const RightIcon = "/assets/icons/right.svg";
const MinusIcon = "/assets/icons/minus.svg";
const PlusIcon = "/assets/icons/plus.svg";
const SuccessIcon = "/assets/icons/success.svg";
const ErrorIcon = "/assets/icons/error.svg";

function TelegramInformation({ id }) {
    const [telegramData, setTelegramData] = useState({});
    const [plans, setPlans] = useState([]);
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
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Slider settings
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                }
            }
        ]
    };


    const fetchTelegramData = async () => {
        try {
            setIsLoading(true);
            const response = await getTelegramFordashboard(id);
            setTelegramData(response.payload.data[0]);
            setPlans(response.payload.data[0].telegramPlan);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleBuyNow = async (plan) => {
        const user = await getCookie('userToken');
        if (user) {

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

            setCoupon('');
            setDiscount(commonDiscountAmount);
            setError('');
            setAppliedCoupon(null);
            setIsModalOpen(true);
        } else {
            router.push('/signin');
        }
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
        if (!selectedPlan) return;

        try {
            setIsProcessingPayment(true);
            setError('');

            const orderData = {
                telegramPlanId: selectedPlan._id,
                couponId: couponId || undefined,
                success_url: 'https://pips-veda.vercel.app/my-courses',
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


    const sortedPlans = [...plans].sort((a, b) => {
        const getMonths = (planType) => {
            const match = planType?.match(/(\d+)/);
            return match ? parseInt(match[0], 10) : 0;
        };
        return getMonths(a.planType) - getMonths(b.planType);
    })
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
                    {isInPerson && <h3>Congratulations!</h3>}
                    <h3>Payment Successful!</h3>
                    <p>Thank you for your purchase. You now have full access to this course.</p>
                </div>

                <Button
                    text="Start Learning"
                    onClick={() => {
                        setShowPaymentModal(false);
                        setIsPaid(false);
                    }}
                />
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
                            handlePayment();
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
        <div className="container">
            {renderPaymentModal()}
            <div className={styles.telegramDetails}>

                {/* Header Section */}
                <div className={styles.telegramDetailsContainer}>
                    <div className={styles.telegramDetailstitle}>
                    <h1>{telegramData?.channelName || <Skeleton width="100%" height={24} />}</h1>
                    <div className={styles.channelGrid}>
                        <div className={styles.channelImageContainer}>
                            {telegramData?.image ? (
                                <img 
                                    src={telegramData.image} 
                                    alt={telegramData.channelName} 
                                    className={styles.channelImage}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    <span>No Image</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.channelDescription}>
                            <p>{telegramData?.description || <Skeleton width="100%" height={24} count={2} />}</p>
                        </div>
                    </div>
                </div>

                    {/* Plans Section */}
                    <div className={styles.plansSection}>
                        <div className={styles.plansTitle}>
                            <h2>Available Plans</h2>
                        </div>
                        {isLoading ? (
                            <div className={styles.plansGrid}>
                                {renderSkeletonCards()}
                            </div>
                        ) : sortedPlans?.length > 0 ? (
                            <Slider {...sliderSettings} className={styles.plansSlider}>
                                {sortedPlans.map((plan) => (
                                    <div key={plan._id} className={styles.planCard}>
                                        <div className={styles.plancardheader}>
                                            <span>{plan.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2')}</span>
                                            <h3>${plan.price.toFixed(2)}</h3>
                                        </div>
                                        <div className={styles.plandetails}>
                                            <div className={styles.plandetailsflx}>
                                                <span>M.R.P :</span>
                                                {plan.initialPrice > plan.price ? (
                                                    <span>${plan.initialPrice.toFixed(2)}</span>
                                                ) : (
                                                    <span>$0.00</span>
                                                )}
                                            </div>
                                            <div className={styles.plandetailsflx}>
                                                <span>Discount :</span>
                                                {plan.discount > 0 ? (
                                                    <span className={styles.redText}>-{plan.discount}%</span>
                                                ) : (
                                                    <span className={styles.redText}>-0%</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            text="Subscribe Now"
                                            onClick={() => handleBuyNow(plan)}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p>No plans available at the moment.</p>
                        )}
                    </div>

                    {/* Purchase Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Complete Your Subscription"
                    >
                        {selectedPlan && (
                            <div className={styles.modalContent}>
                                <div className={styles.planInfo}>
                                    <h3>{selectedPlan.planType?.replace(/(\d+)([A-Za-z]+)/, '$1 $2')} Plan</h3>
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
        </div>
    );
}

export default TelegramInformation;
