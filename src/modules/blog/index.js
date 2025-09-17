'use client'
import React, { useState } from 'react'
import styles from './blog.module.scss';
import BlogBanner from './blogBanner';
import BlogListingCard from './blogBanner/blogListingCard';
export default function Blog() {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <div>
            <BlogBanner searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <BlogListingCard searchQuery={searchQuery}/>
        </div>
    )
}
