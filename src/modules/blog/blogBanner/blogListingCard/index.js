import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './blogListingCard.module.scss';
import Pagination from '@/compoents/pagination';
import OutlineButton from '@/compoents/outlineButton';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_BLOG_DATA, GET_BLOG_CATEGORIES } from '@/graphql/getBlogData';
import { useRouter } from 'next/navigation';
import EmptyState from '@/modules/(admin)/chapter/recentCourse/EmptyState';
import Button from '@/compoents/button';
import UserIcon from '@/icons/userIcon';
import CalanderIcon from '@/icons/calanderIcon';

const BlogcardImage = '/assets/images/blog-card.png';
const ProfileIcon = '/assets/icons/profile-primary.svg';
const DateIcon = '/assets/icons/date-primary.svg';
const RightIcon = '/assets/icons/right.svg';

// Loading Skeleton Component
const BlogCardSkeleton = ({ count = 3, showTabs = true }) => {
    // Tab skeleton with animation
    const tabSkeleton = (
        <div className={styles.tabs}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${styles.skeletonTab} ${i === 1 ? styles.active : ''}`}>
                    <Skeleton width={80} height={40} style={{ borderRadius: '20px' }} />
                </div>
            ))}
        </div>
    );

    // Blog card skeleton
    const blogCardSkeleton = Array(count).fill(0).map((_, index) => (
        <motion.div
            key={index}
            className={styles.griditems}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className={styles.image}>
                <Skeleton height={200} />
            </div>
            <div className={styles.details}>
                <div className={styles.allIconTextAlignment}>
                    <div className={styles.iconText}>
                        <Skeleton circle width={20} height={20} style={{ marginRight: '8px' }} />
                        <Skeleton width={100} height={20} />
                    </div>
                    <div className={styles.iconText}>
                        <Skeleton circle width={20} height={20} style={{ marginRight: '8px' }} />
                        <Skeleton width={80} height={20} />
                    </div>
                </div>
                <h3><Skeleton /></h3>
                <p><Skeleton count={3} /></p>
                <div>
                    <Skeleton width={120} height={40} />
                </div>
            </div>
        </motion.div>
    ));

    return (
        <>
            {showTabs && tabSkeleton}
            <div className={styles.grid}>
                {blogCardSkeleton}
            </div>
        </>
    );
};



export default function BlogListingCard({ searchQuery }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const router = useRouter();

    useEffect(() => {
        const newFilters = {};

        if (searchQuery && searchQuery.trim() !== '') {
            newFilters.title = { contains: searchQuery };
        }

        if (selectedCategory !== 'all') {
            newFilters.categories = {
                slug: { eq: selectedCategory }
            };
        }

        setFilters(newFilters);
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const { data: categoriesData } = useQuery(GET_BLOG_CATEGORIES);

    const { data: blogData, loading, error } = useQuery(GET_ALL_BLOG_DATA, {
        variables: {
            pagination: {
                pageSize: itemsPerPage,
                page: currentPage
            },
            filters: Object.keys(filters).length > 0 ? filters : undefined
        }
    });

    const handleCategorySelect = (slug) => {
        setSelectedCategory(slug);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const categories = categoriesData?.categories || [];
    const blogs = blogData?.blogs_connection?.nodes || [];
    const totalItems = blogData?.blogs_connection?.pageInfo?.total || 0;

    if (loading) {
        return (
            <div className={styles.blogListingCard}>
                <div className='container'>
                    <BlogCardSkeleton count={itemsPerPage} showTabs={true} />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.blogListingCard}>
                <div className='container'>
                    <div className={styles.emptyState}>
                        <EmptyState title={'No Blog Found'} description={'We couldn\'t find any blog posts matching your criteria.'} />
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (blogs.length === 0) {
        return (
            <div className={styles.blogListingCard}>
                <div className='container'>
                    <div className={styles.emptyState}>
                        <EmptyState title={'No Blog Found'} description={'We couldn\'t find any blog posts matching your criteria.'} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.blogListingCard}>
            <div className='container'>
                <div className={styles.tabDesign}>
                    <motion.div
                        className={styles.tabAlignment}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <button
                            className={selectedCategory === 'all' ? styles.activeTab : ''}
                            onClick={() => handleCategorySelect('all')}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.slug}
                                className={selectedCategory === category.slug ? styles.activeTab : ''}
                                onClick={() => handleCategorySelect(category.slug)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {blogs.length > 0 ? (
                        blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id || index}
                                className={styles.griditems}
                                variants={cardVariants}
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className={styles.image}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img src={process.env.NEXT_PUBLIC_NEXT_GRAPHQL_IMAGE_URL + blog?.coverImage?.url} alt="BlogcardImage" />
                                </motion.div>
                                <div className={styles.details}>
                                    <motion.div
                                        className={styles.allIconTextAlignment}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className={styles.iconText}>
                                            {/* <img src={ProfileIcon} alt="ProfileIcon" /> */}
                                            <UserIcon />
                                            <span>{blog.author.name}</span>
                                        </div>
                                        <div className={styles.iconText}>
                                            {/* <img src={DateIcon} alt="DateIcon" /> */}
                                            <CalanderIcon />
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                                    <motion.h3
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                        className={styles.heading}
                                    >
                                        {blog.title}
                                    </motion.h3>
                                    <p>
                                        {blog.shortDescription}
                                    </p>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button text="Read More" icon={RightIcon} onClick={() => router.push(`/blog/${blog.slug}`)} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            No blog posts found matching your criteria.
                        </div>
                    )}
                </motion.div>

                {totalItems > itemsPerPage && (
                    <div className={styles.paginationWrapper}>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}