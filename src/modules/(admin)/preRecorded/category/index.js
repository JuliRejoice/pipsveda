'use client'
import React, { useEffect, useState } from 'react'
import styles from './category.module.scss'
import { getAllCourseCategory } from '@/compoents/api/dashboard';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Category({searchQuery}) {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCourseCategory({searchQuery});
            setCategories(response?.payload?.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [searchQuery]);

    const renderSkeletons = () => {
        return Array(4).fill(0).map((_, index) => (
            <div className={styles.box} key={`skeleton-${index}`}>
                <div className={styles.image}>
                    <Skeleton height="100%" />
                </div>
                <div className={styles.details}>
                    <Skeleton width="80%" height={24} />
                    <Skeleton width="40%" height={16} style={{ marginTop: '8px' }} />
                </div>
            </div>
        ));
    };

    return (
        <div className={styles.categoriesSectionAlignment}>
            <div>
                <div className={styles.title}>
                    <h2>Explore by variety of topics</h2>
                    <p>Choose from a wide range of focused financial categories</p>
                </div>
                <div className={styles.categoriesGrid}>
                    {loading ? (
                        renderSkeletons()
                    ) : categories.length > 0 ? (
                        categories.map((cat) => (
                            <div 
                                className={styles.box} 
                                key={cat?._id} 
                                onClick={() => router.push(`/categories/${cat?._id}`)}
                            >
                                <div className={styles.image}>
                                    <img 
                                        src={cat?.image} 
                                        alt={cat?.name || 'Category'} 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/path-to-default-image.jpg';
                                        }}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <p>{cat?.name || 'Unnamed Category'}</p>
                                    <span>{cat?.courseCount} {cat?.courseCount <= 1 ? 'Course' : 'Courses'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noCategories}>
                            <p>No categories available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
