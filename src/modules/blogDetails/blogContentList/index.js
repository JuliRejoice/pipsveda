import React from 'react'
import styles from './blogContentList.module.scss';
const BlogDetailsImage = '/assets/images/blog-details.png';
const DateIcon = '/assets/icons/date-primary.svg';
import { marked } from "marked";
const ProfileIcon = '/assets/icons/profile-primary.svg';

export default function BlogContentList({ blog }) {
    return (
        <div className={styles.blogContentList}>
            <div className='container'>
                <div className={styles.detailsBox}>
                    <div className={styles.image}>
                        <img src={process.env.NEXT_PUBLIC_NEXT_GRAPHQL_IMAGE_URL + blog?.detailImage?.url} alt="BlogDetailsImage" />
                    </div>
                    <div className={styles.iconText}>
                        <img src={DateIcon} alt="DateIcon" />
                        <span>{new Date(blog?.createdAt).toLocaleDateString()}</span>
                        <img src={ProfileIcon} alt="ProfileIcon" />
                        <span>{blog?.author.name}</span>
                    </div>
                    <div
                        className="prose" // optional: tailwind typography styles
                        dangerouslySetInnerHTML={{ __html: marked(blog?.blogContent) }}
                    />
                </div>
            </div>
        </div>
    )
}
