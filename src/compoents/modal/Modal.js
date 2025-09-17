'use client';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';
import CloseIcon from '@/icons/closeIcon';


const Modal = ({ isOpen, onClose, children, title, showCloseButton = true }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {(title || showCloseButton) && (
          <div className={styles.modalHeader}>
            <div>
              {title && <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>}
            </div>
            {/* {showCloseButton && (
              <button 
                onClick={onClose} 
                className={styles.closeButton}
                aria-label="Close modal"
              >
                <X size={24} />
                X
              </button>
            )} */}
            <div onClick={onClose}><CloseIcon /></div>
          </div>
        )}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
