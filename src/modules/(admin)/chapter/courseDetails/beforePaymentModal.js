import React from "react";
import Modal from "@/compoents/modal/Modal";
import styles from "./beforePaymentModal.module.scss";
import Button from "@/compoents/button";

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
}) {
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
        </div>
      </>
    );
  };

  return (
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
            onClick={onConfirm}
            disabled={isProcessing}
          />
        </div>
      </div>
    </Modal>
  );
}

export default BeforePaymentModal;
