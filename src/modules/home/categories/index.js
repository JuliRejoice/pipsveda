'use client'
import React, { useEffect, useState } from 'react'
import styles from './categories.module.scss'
import Slider from "react-slick";
import { getAllCourseCategory } from '@/compoents/api/dashboard';


export default function Categories() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
        ]

    };


    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await getAllCourseCategory();
            setCategories(response.payload.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className={styles.categoriesSectionAlignment}>
            <div className='container'>
                <div className={styles.title}>
                    <h2>
                        Explore by variety of topics
                    </h2>
                    <p>
                        Choose from a wide range of focused financial caregories
                    </p>
                </div>
                <Slider {...settings}>
                    {categories.map((cat) => {
                            return (
                                <div className={styles.box}>
                                    <div className={styles.image}>
                                        <img src={cat?.image} />
                                    </div>
                                    <div className={styles.details}>
                                        <p>
                                            {cat?.name}
                                        </p>
                                        <span>112 Courses</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>
        </div>
    )
}
