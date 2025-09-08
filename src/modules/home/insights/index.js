'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './insights.module.scss';
import UserIcon from '@/icons/userIcon';
import CalanderIcon from '@/icons/calanderIcon';
import Button from '@/compoents/button';
import { GET_ALL_BLOG_DATA, GET_BLOG_CATEGORIES } from '@/graphql/getBlogData';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import ProfileIcon from '@/icons/profileIcon';
import DateIcon from '@/icons/dateIcon';
import OutlineButton from '@/compoents/outlineButton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BottomVec = '/assets/images/bottomvec.png';
const BlogImage = '/assets/images/blog-img.png';
const RightIcon = '/assets/icons/right-white.svg';

// Animation Variants
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Keep variants free of transform properties to avoid conflicts with hover tilt
const cardVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function Insights() {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { data: blogData, loading, error } = useQuery(GET_ALL_BLOG_DATA, {
    variables: {
      pagination: {
        pageSize: itemsPerPage,
        page: currentPage
      },
    }
  });

  useEffect(() => {
    if (blogData) {
      setBlogs(blogData?.blogs_connection?.nodes);
    }
  }, [blogData]);

  // Skeleton loading component
  const renderSkeletonCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <motion.div
        className={styles.griditems}
        key={`skeleton-${index}`}
        variants={cardVariants}
        custom={index}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className={styles.image}>
          <Skeleton height={200} style={{ marginBottom: '1rem' }} />
        </div>
        <div className={styles.content}>
          <div className={styles.category}>
            <Skeleton width={100} height={24} />
          </div>
          <h3>
            <Skeleton count={2} />
          </h3>
          <p className={styles.desc}>
            <Skeleton count={3} />
          </p>
          <div className={styles.author}>
            <div className={styles.authorInfo}>
              <Skeleton circle width={32} height={32} style={{ marginRight: '0.5rem' }} />
              <Skeleton width={100} height={16} />
            </div>
            <div className={styles.date}>
              <Skeleton width={80} height={16} />
            </div>
          </div>
        </div>
      </motion.div>
    ));
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    // Tilt range in degrees
    const rotateRange = 10;
    const rotateY = ((x - midX) / midX) * rotateRange; // left/right
    const rotateX = -((y - midY) / midY) * rotateRange; // up/down (invert for natural feel)

    card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
  };

  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--s', '1.03');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--s', '1');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <div className={styles.insights}>
      <div className={styles.bottomVec}>
        <img src={BottomVec} alt='BottomVec' />
      </div>
      <div className='container' ref={ref}>
        {/* Section Title */}
        <motion.div
          className={styles.title}
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2>Financial Insights & Articles</h2>
          <p>
            Explore our curated writings on markets, strategies, and more
          </p>
        </motion.div>

        {/* Blog Cards */}
        <div className={styles.grid}>
          {loading ? (
            renderSkeletonCards()
          ) : (
            blogs.map((blog, i) => (
              <motion.div
                className={styles.griditems}
                key={i}
                variants={cardVariants}
                custom={i}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform:
                  'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--s, 1))',
                transformStyle: 'preserve-3d',
                transition: 'transform 150ms ease',
                willChange: 'transform',
              }}
            >
                <div className={styles.image}>
                  <img 
                    src={process.env.NEXT_PUBLIC_NEXT_GRAPHQL_IMAGE_URL + blog?.coverImage?.url} 
                    alt={blog.title} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = BlogImage;
                    }}
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.allIconText}>
                    <div className={styles.iconText}>
                      <UserIcon />
                      <span>{blog.author?.name || 'Anonymous'}</span>
                    </div>
                    <div className={styles.iconText}>
                      <CalanderIcon />
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  <h3>{blog.title}</h3>
                  <p>{blog.shortDescription}</p>
                  <OutlineButton 
                    text="Read More" 
                    onClick={() => router.push(`/blog/${blog.slug}`)}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
