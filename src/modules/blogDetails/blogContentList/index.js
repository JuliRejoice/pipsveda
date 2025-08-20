import React from 'react'
import styles from './blogContentList.module.scss';
const BlogDetailsImage = '/assets/images/blog-details.png';
const DateIcon = '/assets/icons/date-primary.svg';
export default function BlogContentList() {
    return (
        <div className={styles.blogContentList}>
            <div className='container'>
                <div className={styles.detailsBox}>
                    <div className={styles.image}>
                        <img src={BlogDetailsImage} alt="BlogDetailsImage" />
                    </div>
                    <div className={styles.iconText}>
                        <img src={DateIcon} alt="DateIcon" />
                        <span>October 20, 2024</span>
                    </div>
                    <p>
                        Objectively restore stand-alone markets rather than enterprise-wide products. Uniquely underwhelm best-of-breed mindshare through adaptive niches. Interactively leverage existing innovative e-services seamlessly parallel task open-source content without resource
                        sucking technology.
                    </p>
                    <p>
                        Objectively restore stand-alone markets rather than enterprise-wide products. Uniquely underwhelm best-of-breed mindshare through adaptive niches. Interactively leverage existing innovative e-services seamlessly parallel task open-source content without resource
                        sucking technology.
                    </p>
                    <div className={styles.image}>
                        <img src={BlogDetailsImage} alt="BlogDetailsImage" />
                    </div>
                    <p>
                        Objectively restore stand-alone markets rather than enterprise-wide products. Uniquely underwhelm best-of-breed mindshare through adaptive niches. Interactively leverage existing innovative e-services seamlessly parallel task open-source content without resource
                        sucking technology.
                    </p>
                    <p>
                        Objectively restore stand-alone markets rather than enterprise-wide products. Uniquely underwhelm best-of-breed mindshare through adaptive niches. Interactively leverage existing innovative e-services seamlessly parallel task open-source content without resource
                        sucking technology.
                    </p>
                    <p>
                        Credibly visualize distinctive testing procedures without end-to-end ROI. Seamlessly brand cross-
                        platform communities with backend markets. Assertively utilize business services through robust
                        solutions. Rapidiously deliver cross-unit infrastructures rather than accurate metrics.
                    </p>
                </div>
            </div>
        </div>
    )
}
