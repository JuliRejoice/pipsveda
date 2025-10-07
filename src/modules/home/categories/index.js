'use client'
import React from 'react'
import styles from './categories.module.scss'
import Slider from "react-slick";


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
                    {
                        [...Array(7)].map(() => {
                            return (
                                <div className={styles.box}>
                                    <div className={styles.image}>
                                        <img src="https://pips-veda.netlify.app/assets/images/blog-img.png" />
                                    </div>
                                    <div className={styles.details}>
                                        <p>
                                            Forex Trading
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
