'use client'
import React, { useState } from 'react'
import styles from './ourSyllabus.module.scss';
import DownArrow from '@/icons/downArrow';
import classNames from 'classnames';

const chapterData = [
    { title: 'Chapter 1 ', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.' },
    { title: 'Chapter 2', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.' },
    { title: 'Chapter 3', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.' },
    { title: 'Chapter 4', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.' },
];

export default function OurSyllabus() {
    const [activeIndex, setActiveIndex] = useState(0); // First box open by default

    const handleToggle = (index) => {
        setActiveIndex(prev => (prev === index ? -1 : index)); // Close if same clicked
    };

    return (
        <div className={styles.ourSyllabus}>
            <div className={styles.title}>
                <h3>Our Syllabus</h3>
            </div>

            {chapterData.map((item, index) => (
                <div key={index} className={styles.mainToogle}>
                    <div className={styles.toogleHeader}>
                        <h3><span>{item.title} : </span> This line is written for dummy text.</h3>
                        <div
                            className={classNames(styles.icons, activeIndex === index ? styles.rotate : '')}
                            onClick={() => handleToggle(index)}
                        >
                            <DownArrow />
                        </div>
                    </div>

                    <div className={classNames(
                        styles.faqBody,
                        activeIndex === index ? styles.show : styles.hide
                    )}>
                        <div className={styles.spacing}>
                            <p>{item.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
