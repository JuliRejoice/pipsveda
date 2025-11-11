// src/components/ReviewSystem/index.js
import React, { useState, useEffect } from 'react';
import { getCourseRatingByUser, submitReview } from '@/compoents/api/dashboard';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

 useEffect(() => {
  const getRating = async () => {
    try {
      const res = await getCourseRatingByUser();
      console.log(res)
      if (res.success && res.payload) {
        const courseRating = res.payload.find(
          item => item.courseId._id === courseId
        );
        console.log(courseRating)
        if (courseRating) {
          setRating(courseRating.rating);
          setHasRated(true); // User has already rated
        }
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      toast.error('Failed to load your rating');
    }
  };

  if (courseId) {
    getRating();
  }
}, [courseId]);

  console.log(rating)

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isPaid || hasRated) return; // Prevent submission if already rated

  try {
    setIsSubmitting(true);
    await submitReview({
      courseId,
      rating,
      userId
    });
    toast.success('Rating submitted successfully!');
    setHasRated(true); // Mark as rated after successful submission
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error('Failed to submit rating');
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className={styles.reviewSystem}>
   
      {isPaid && (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div>
            <h4>Rate us</h4>
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles.starButton}
                  onClick={() => !hasRated && setRating(star)}
                  onMouseEnter={() => !hasRated && setHoverRating(star)}
                  onMouseLeave={() => !hasRated && setHoverRating(0)}
                  disabled={hasRated || isSubmitting}
                >
                  <StarIcon
                    filled={star <= (hoverRating || rating)}
                    className={`${styles.starIcon} ${hasRated ? styles.rated : ''}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || rating !== 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      )}

    </div>
  );
};

export default ReviewSystem;