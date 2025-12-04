"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/compoents/modal/Modal";
import styles from "./beforePaymentModal.module.scss";
import Button from "@/compoents/button";
import ClockGreyIcon from "@/icons/clockGreyIcon";
import { getProfile } from "@/compoents/api/auth";
import { getCookie } from "../../../../../cookie";

function BeforePaymentModal({
  isOpen,
  onClose,
  onConfirm,
  selectedBatch,
  courseName,
  isProcessing,
  isInPerson = false,
  isLiveOnline = false,
  isRecorded = false,
  coursePrice,
}) {
  const [useWallet, setUseWallet] = useState(false);
  const [user, setUser] = useState(null);
  const [showWalletConfirm, setShowWalletConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProfile = async () => {
      try {
        const userData = getCookie("user");
        const parsedUser = JSON.parse(userData)._id;
        const response = await getProfile(parsedUser);
        const user = response.payload.data[0];

        setUser(user);

      } catch (error) {
        console.error('Error fetching profile:', error);
        // toast.error('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  if (!isRecorded && !selectedBatch) {
    return (
      <Modal isOpen={true} onClose={onClose}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3>No Batch Selected</h3>
            <button onClick={onClose} className={styles.closeButton}>
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            <p>Please select a batch to proceed with the payment.</p>
          </div>
          <div className={styles.modalFooter}>
            <Button text="Close" onClick={onClose} variant="outline" />
          </div>
        </div>
      </Modal>
    );
  }

  //   const { city, state, country, courseId, batchName, startDate, endDate, timing } = selectedBatch;

  const handleConfirm = () => {
    // Show wallet confirmation modal if wallet is being used
    if (useWallet) {
      setShowWalletConfirm(true);
      return;
    }

    proceedWithPayment();
  };

  const proceedWithPayment = () => {
    console.log(coursePrice,"coursePrice");
    console.log(user?.earningBalance,"user?.earningBalance");
    
    const walletBalance = parseFloat(user?.earningBalance) || 0;
    const price = parseFloat(coursePrice) || 0;
    
    const walletData = {
      isWalletUse: useWallet,
      walletAmount: useWallet ? Math.min(walletBalance, price) : 0,
      actualAmount: useWallet ? (walletBalance > price ? 0 : price - walletBalance) : price,
      price: price,
    };
    console.log('Final walletData:', walletData);
    onConfirm(walletData);
  };

  const handleWalletConfirm = () => {
    setShowWalletConfirm(false);
    proceedWithPayment();
  };

  const renderContent = () => {
    if (isRecorded) {
      return (
        <>
          <div className={styles.modalBody}>
            <div className={styles.note}>
              <p>
                You are about to enroll in the recorded course:{" "}
                <strong>{courseName}</strong>.
              </p>
              <p>
                You will have lifetime access to all course materials after
                payment.
              </p>
            </div>
            {/* Wallet Section for Recorded Courses */}
            {user?.earningBalance !== undefined && user?.earningBalance > 0 && (
              <div className={styles.walletSection}>
                <label className={styles.walletCheckbox}>
                  <input
                    type="checkbox"
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                  />
                  <span className={styles.walletLabel}>
                    Use Wallet Balance
                    <span className={styles.walletAmount}>
                      (Available: ${user?.earningBalance.toFixed(2)})
                    </span>
                  </span>
                </label>
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <div className={styles.modalBody}>
          {/* Only show location section for in-person courses */}
          {isInPerson && selectedBatch && (
            <div className={styles.locationSection}>
              <h4>Location Details</h4>
              <div className={styles.locationGrid}>
                <div className={styles.locationItem}>
                  <span className={styles.label}>City</span>
                  <span className={styles.value}>
                    {selectedBatch?.centerId?.city || "Not specified"}
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.label}>State</span>
                  <span className={styles.value}>
                    {selectedBatch?.centerId?.state || "Not specified"}
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.label}>Country</span>
                  <span className={styles.value}>
                    {selectedBatch?.centerId?.country || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.batchDetails}>
            <h4>Batch Details</h4>

            <div className={styles.detailItem}>
              <span className={styles.label}>Course Name</span>
              <span className={styles.value}>{courseName || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Start Date</span>
              <span className={styles.value}>
                {selectedBatch?.startDate
                  ? new Date(selectedBatch.startDate).toLocaleDateString("en-GB")
                  : "To be announced"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>End Date</span>
              <span className={styles.value}>
                {selectedBatch?.endDate
                  ? new Date(selectedBatch.endDate).toLocaleDateString("en-GB")
                  : "To be announced"}
              </span>
            </div>
            {/* <div className={styles.detailItem}>
              <span className={styles.label}>Timing</span>
              <span className={styles.value}>
                {selectedBatch?.timing || 'To be announced'}
              </span>
            </div> */}
          </div>

          {/* Wallet Section */}
          {user?.earningBalance !== undefined && user?.earningBalance > 0 && (
            <div className={styles.walletSection}>
              <label className={styles.walletCheckbox}>
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={(e) => setUseWallet(e.target.checked)}
                />
                <span className={styles.walletLabel}>
                  Use Wallet Balance
                  <span className={styles.walletAmount}>
                    (Available: ${user?.earningBalance.toFixed(2)})
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Before You Proceed"
      >
        <div className={styles.modalContent}>
          {renderContent()}

          <div className={styles.commonnote}>
            <p>
              <strong>Note:</strong> Please verify all the details before
              proceeding to payment. Once payment is made, it cannot be refunded.
            </p>
          </div>

          <div className={styles.modalFooter}>
            <Button
              text="Cancel"
              onClick={onClose}
              variant="outline"
              disabled={isProcessing}
            />
            <Button
              text={isProcessing ? "Processing..." : "Proceed to Payment"}
              onClick={handleConfirm}
              disabled={isProcessing}
            />
          </div>
        </div>
      </Modal>

      {/* Wallet Confirmation Modal */}
      <Modal
        isOpen={showWalletConfirm}
        onClose={() => setShowWalletConfirm(false)}
        title="Confirm Wallet Usage"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalBody}>
            <div className={styles.note}>
              <ul>
                <li style={{paddingBottom : "20px"}}>
                  Are you sure you want to use your wallet balance of{" "}
                  <strong>${parseFloat(user?.earningBalance || 0).toFixed(2)}</strong>?
                </li>
                <li>
                  {parseFloat(user?.earningBalance || 0) >= parseFloat(coursePrice || 0) 
                    ? `Your wallet balance covers the full course price. $${parseFloat(coursePrice || 0).toFixed(2)} will be deducted from your wallet and $${(parseFloat(user?.earningBalance || 0) - parseFloat(coursePrice || 0)).toFixed(2)} will remain in your wallet.`
                    : `This amount will be deducted from your wallet and the remaining $${Math.max(0, parseFloat(coursePrice || 0) - parseFloat(user?.earningBalance || 0)).toFixed(2)} will be charged to your payment method.`
                  }
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button
              text="Cancel"
              onClick={() => setShowWalletConfirm(false)}
              variant="outline"
            />
            <Button
              text="Confirm"
              onClick={handleWalletConfirm}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BeforePaymentModal;
