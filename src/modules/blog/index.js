import React from 'react'
import styles from './blog.module.scss';
import BlogBanner from './blogBanner';
import BlogListingCard from './blogBanner/blogListingCard';
export default function Blog() {
    return (
        <div>
            <BlogBanner />
            <BlogListingCard />
        </div>
    )
}
