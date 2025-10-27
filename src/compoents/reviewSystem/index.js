// src/components/ReviewSystem/index.js
import React, { useState, useEffect } from 'react';
import { submitReview, getCourseReviews } from '@/compoents/api/dashboard';
import { toast } from 'react-hot-toast';
import styles from './reviewSystem.module.scss';

const StarIcon = ({ filled, className = '' }) => (
  <img 
    src={`/assets/icons/${filled ? 'star' : 'star-empty'}.svg`} 
    alt={filled ? 'Filled star' : 'Empty star'} 
    className={`${styles.starIcon} ${className}`}
  />
);

const ReviewSystem = ({ courseId, isPaid, userId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await getCourseReviews(courseId);
      setReviews(response?.payload?.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPaid) {
      toast.error('Please purchase the course to submit a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitReview({
        courseId,
        rating,
        review,
        userId
      });
      toast.success('Review submitted successfully!');
      setRating(0);
      setReview('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className={styles.reviewSystem}>
      <h3>Course Reviews</h3>
      
   <div className={styles.ratingSummary}>
        <div className={styles.averageRating}>
          <span className={styles.averageNumber}>{calculateAverageRating()}</span>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon 
                key={star} 
                filled={star <= Math.floor(calculateAverageRating())} 
              />
            ))}
          </div>
          <span className={styles.reviewCount}>({reviews.length} reviews)</span>
        </div>
      </div>

      {isPaid && (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <h4>Write a Review</h4>
           <div className={styles.ratingInput}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={styles.starButton}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <StarIcon 
                  filled={star <= (hoverRating || rating)} 
                  className={styles.starIcon} 
                />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this course..."
            className={styles.reviewInput}
            rows={4}
            required
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className={styles.reviewsList}>
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((item) => (
            <div key={item._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{item.user?.name || 'Anonymous'}</span>
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={`${styles.starIcon} ${i < item.rating ? styles.filled : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <span className={styles.reviewDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.reviewText}>{item.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;