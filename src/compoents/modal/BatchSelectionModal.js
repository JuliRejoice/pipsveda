'use client';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.scss';
import Button from '../button';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { toast } from 'react-hot-toast';
import { getCookie } from '../../../cookie';
import { getBatches } from '../api/dashboard';

const BatchSelectionModal = ({
  isOpen,
  onClose,
  courseId,
  batches,
  onBatchSelect,
  onBatchesUpdate,
  courseTitle = 'Course',
  isLoading = false,
  showMatchLocation = false,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [error, setError] = useState(null);
  const [isMatchLocation, setIsMatchLocation] = useState(false);
  const [isFetchingBatches, setIsFetchingBatches] = useState(false);

  const handleProceed = () => {
    if (!selectedBatchId) return;
    if (selectedBatchId) {
      onBatchSelect(selectedBatchId);
    }
  };

  const handleMatchLocationToggle = async (checked) => {
    setIsMatchLocation(checked);
    setIsFetchingBatches(true);
    setError(null);
    
    try {
      const response = await getBatches({ courseId, isMatchBatch: checked });
      if (response?.payload?.data) {
        // Update batches in parent component
        onBatchesUpdate(response.payload.data);
        // Clear selected batch since batches changed
        setSelectedBatchId(null);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      setError('Failed to fetch batches. Please try again.');
    } finally {
      setIsFetchingBatches(false);
    }
  };

  if (!isOpen) return null;
  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Select a Batch for ${courseTitle}`}
    >
      <div className={styles.batchSelectionContainer}>
        {error ? (
          <div className={styles.errorState}>{error}</div>
        ) : isLoading || isFetchingBatches ? (
          <div className={styles.skeletonContainer}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeletonItem}>
                <Skeleton height={90} width="100%" />
                {/* <Skeleton height={16} width="60%" style={{ marginBottom: '8px' }} />
                <Skeleton height={16} width="60%" style={{ marginBottom: '8px' }} />
                {i % 2 === 0 && <Skeleton height={16} width="50%" />} */}
              </div>
            ))}
          </div>
        ) : batches.length > 0 ? (
          <div className={styles.batchList}>
            {batches.map((batch) => (
              <div
                key={batch._id}
                className={`${styles.batchItem} ${selectedBatchId === batch._id ? styles.selected : ''}`}
                onClick={() => setSelectedBatchId(batch._id)}
              >
                <div className={styles.batchInfo}>
                  <h4>{batch.batchName || `Batch ${new Date(batch.startDate).getFullYear()}`}</h4>
                  <p>Starts: {new Date(batch.startDate).toLocaleDateString("en-GB")}</p>
                  <p>Ends: {new Date(batch.endDate).toLocaleDateString("en-GB")}</p>
                  {batch?.centerId?.centerName && <p>Center: {batch?.centerId?.centerName || 'N/A'}</p>}
                </div>
                {selectedBatchId === batch._id && (
                  <div className={styles.selectedBadge}>Selected</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No batches available at the moment. Please check back later.</p>
        )}

      </div>
      {showMatchLocation && (
        <div className={styles.matchLocationContainer}>
          <label className={styles.toggleLabel}>
            <span className={styles.labelText}>Match Location</span>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={isMatchLocation}
                onChange={(e) => handleMatchLocationToggle(e.target.checked)}
                className={styles.toggleInput}
                disabled={isFetchingBatches}
              />
              <span className={styles.toggleSlider}></span>
            </div>
          </label>
        </div>)
      }

      <div className={styles.modalActions}>
        <Button
          text="Cancel"
          onClick={onClose}
          variant="outline"
          disabled={isLoading}
        />
        <Button
          text={isLoading ? 'Loading...' : 'Proceed to Payment'}
          onClick={handleProceed}
          disabled={!selectedBatchId || isLoading}
        />
      </div>
    </Modal>
  );
};

export default BatchSelectionModal;
