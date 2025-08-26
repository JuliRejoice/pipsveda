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

const BottomVec = '/assets/images/bottomvec.png';
const BlogImage = '/assets/images/blog-img.png';
const RightIcon = '/assets/icons/right-white.svg';

// Animation Variants
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
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
          {blogs.map((blog, i) => (
            <motion.div
              className={styles.griditems}
              key={i}
              variants={cardVariants}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
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
          ))}
        </div>
      </div>
    </div>
  );

  // const [selectedCategory, setSelectedCategory] = useState('all');
  // const [filters, setFilters] = useState({});
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 3; 
  // const router = useRouter  ();

  // useEffect(() => {
  //     const newFilters = {};

      
  //     if (selectedCategory !== 'all') {
  //         newFilters.categories = {
  //             slug: { eq: selectedCategory }
  //         };
  //     }
      
  //     setFilters(newFilters);
  //     setCurrentPage(1);
  // }, [selectedCategory]);

  // const { data: categoriesData } = useQuery(GET_BLOG_CATEGORIES);

  // const { data: blogData, loading, error } = useQuery(GET_ALL_BLOG_DATA, {
  //     variables: {
  //         pagination: {
  //             pageSize: itemsPerPage,
  //             page: currentPage
  //         },
  //         filters: Object.keys(filters).length > 0 ? filters : undefined
  //     }
  // });

  // const handleCategorySelect = (slug) => {
  //     setSelectedCategory(slug);
  // };

  // const handlePageChange = (page) => {
  //     setCurrentPage(page);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  // const containerVariants = {
  //     hidden: { opacity: 0 },
  //     visible: {
  //         opacity: 1,
  //         transition: {
  //             staggerChildren: 0.1
  //         }
  //     }
  // };

  // const cardVariants = {
  //     hidden: { y: 50, opacity: 0 },
  //     visible: {
  //         y: 0,
  //         opacity: 1,
  //         transition: {
  //             duration: 0.5
  //         }
  //     }
  // };

  // const categories = categoriesData?.categories || [];
  // const blogs = blogData?.blogs_connection?.nodes || [];
  // const totalItems = blogData?.blogs_connection?.pageInfo?.total|| 0;

  // // Debug logs
  // console.log('Pagination Debug:', {
  //     currentPage,
  //     totalItems,
  //     itemsPerPage,
  //     shouldShowPagination: totalItems > itemsPerPage,
  //     blogData: blogData?.blogs_connection?.meta?.pagination
  // });

  // // Loading state
  // if (loading) {
  //     return (
  //         <div className={styles.blogListingCard}>
  //             <div className='container'>
  //                 {/* <BlogCardSkeleton count={itemsPerPage} showTabs={true} /> */}
  //             </div>
  //         </div>
  //     );
  // }

  // // Error state
  // if (error) {
  //     return (
  //         <div className={styles.blogListingCard}>
  //             <div className='container'>
  //                 <div className={styles.emptyState}>
  //                     <EmptyState title={'No Blog Found'} description={'We couldn\'t find any blog posts matching your criteria.'} />
  //                 </div>
  //             </div>
  //         </div>
  //     );
  // }

  // // Empty state
  // if (blogs.length === 0) {
  //     return (
  //         <div className={styles.blogListingCard}>
  //             <div className='container'>
  //                 <EmptyState />
  //             </div>
  //         </div>
  //     );
  // }

  // return (
  //     <div className={styles.blogListingCard}>
  //         <div className='container'>
  //             <motion.div
  //                 className={styles.tabAlignment}
  //                 initial={{ opacity: 0, y: -20 }}
  //                 animate={{ opacity: 1, y: 0 }}
  //                 transition={{ duration: 0.5 }}
  //             >
  //                 <button 
  //                     className={selectedCategory === 'all' ? styles.activeTab : ''}
  //                     onClick={() => handleCategorySelect('all')}
  //                 >
  //                     All
  //                 </button>
  //                 {categories.map((category) => (
  //                     <button
  //                         key={category.slug}
  //                         className={selectedCategory === category.slug ? styles.activeTab : ''}
  //                         onClick={() => handleCategorySelect(category.slug)}
  //                     >
  //                         {category.name}
  //                     </button>
  //                 ))}
  //             </motion.div>

  //             <motion.div
  //                 className={styles.grid}
  //                 variants={containerVariants}
  //                 initial="hidden"
  //                 animate="visible"
  //             >
  //                 {blogs.length > 0 ? (
  //                     blogs.map((blog, index) => (
  //                         <motion.div
  //                             key={blog.id || index}
  //                             className={styles.griditems}
  //                             variants={cardVariants}
  //                             whileHover={{ scale: 1.01 }}
  //                             transition={{ duration: 0.2 }}
  //                         >
  //                             <motion.div
  //                                 className={styles.image}
  //                                 whileHover={{ scale: 1.05 }}
  //                                 transition={{ duration: 0.2 }}
  //                             >
  //                                 <img src={process.env.NEXT_PUBLIC_NEXT_GRAPHQL_IMAGE_URL + blog?.coverImage?.url} alt="BlogcardImage" />
  //                             </motion.div>
  //                             <div className={styles.details}>
  //                                 <motion.div
  //                                     className={styles.allIconTextAlignment}
  //                                     initial={{ opacity: 0 }}
  //                                     animate={{ opacity: 1 }}
  //                                     transition={{ delay: 0.2 }}
  //                                 >
  //                                     <div className={styles.iconText}>
  //                                         <img src={ProfileIcon} alt="ProfileIcon" />
  //                                         <span>{blog.author.name}</span>
  //                                     </div>
  //                                     <div className={styles.iconText}>
  //                                         <img src={DateIcon} alt="DateIcon" />
  //                                         <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
  //                                     </div>
  //                                 </motion.div>
  //                                 <motion.h3
  //                                     whileHover={{ scale: 1.01 }}
  //                                     transition={{ duration: 0.2 }}
  //                                 >
  //                                     {blog.title}
  //                                 </motion.h3>
  //                                 <p>
  //                                     {blog.shortDescription}
  //                                 </p>
  //                                 <motion.div
  //                                     whileHover={{ x: 5 }}
  //                                     transition={{ duration: 0.2 }}
  //                                 >
  //                                     <OutlineButton text="Read More" icon={RightIcon} onClick={() => router.push(`/blog/${blog.slug}`)}/>
  //                                 </motion.div>
  //                             </div>
  //                         </motion.div>
  //                     ))
  //                 ) : (
  //                     <div className={styles.noResults}>
  //                         No blog posts found matching your criteria.
  //                     </div>
  //                 )}
  //             </motion.div>

  //             {totalItems > itemsPerPage && (
  //                 <div className={styles.paginationWrapper}>
  //                     <Pagination
  //                         currentPage={currentPage}
  //                         totalItems={totalItems}
  //                         itemsPerPage={itemsPerPage}
  //                         onPageChange={handlePageChange}
  //                     />
  //                 </div>
  //             )}
  //         </div>
  //     </div>)
}
