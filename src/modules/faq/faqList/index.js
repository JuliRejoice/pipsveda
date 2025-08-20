'use client'
import React, { useState } from 'react'
import styles from './faqList.module.scss';
import classNames from 'classnames';
const AddIcon = '/assets/icons/add.svg';

const faqs = [
    {
        question: "01. Lorem Ipsum is simply dummy text of the printing industry?",
        answer:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
    },
    {
        question: "02. Why do we use it?",
        answer:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
        question: "03. Where can I get some?",
        answer:
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
    },
    {
        question: "04. What is Lorem Ipsum?",
        answer:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
        question: "05. Is it safe to use Lorem Ipsum?",
        answer:
            "Yes, Lorem Ipsum is simply dummy text and has no meaning. It is commonly used as placeholder text.",
    },
    {
        question: "06. Who invented Lorem Ipsum?",
        answer:
            "Lorem Ipsum has been used since the 1500s, when an unknown printer scrambled a type specimen book.",
    },
];
export default function FaqList() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    return (
        <div className={styles.faqList}>
            <div className='container'>
                <div className={styles.listbox}>
                    {faqs.map((faq, index) => (
                        <div key={index} className={styles.mainfaq}>
                            <div
                                className={classNames(
                                    styles.faqheader,
                                    activeIndex === index ? styles.rotateicon : ""
                                )}
                            >
                                <h2>{faq.question}</h2>
                                <img
                                    onClick={() => toggleFAQ(index)}
                                    src={AddIcon}
                                    alt="AddIcon"
                                />
                            </div>

                            <div
                                className={classNames(
                                    styles.faqBody,
                                    activeIndex === index ? styles.show : styles.hide
                                )}
                            >
                                <div className={styles.spacing}>
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
