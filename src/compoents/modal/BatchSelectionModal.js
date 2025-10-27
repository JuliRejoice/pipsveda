'use client';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.scss';
import Button from '../button';

import { toast } from 'react-hot-toast';
import { getCookie } from '../../../cookie';

const BatchSelectionModal = ({ 
  isOpen, 
  onClose, 
  courseId,
  batches,
  onBatchSelect,
  courseTitle = 'Course'
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  console.log("🚀 ~ BatchSelectionModal ~ selectedBatchId:", selectedBatchId)

  
  
  const handleProceed = () => {
    if (!selectedBatchId) return;
    console.log("selectedBatchId", selectedBatchId);
    if (selectedBatchId) {
      onBatchSelect(selectedBatchId);
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
        {isLoading ? (
          <div className={styles.loadingState}>Loading batches...</div>
        ) : error ? (
          <div className={styles.errorState}>{error}</div>
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
                  <p>Starts: {new Date(batch.startDate).toLocaleDateString()}</p>
                  <p>Ends: {new Date(batch.endDate).toLocaleDateString()}</p>
                  <p>Center: {batch?.centerId?.centerName || 'N/A'}</p>
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
      </div>
    </Modal>
  );
};

export default BatchSelectionModal;
