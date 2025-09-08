'use client'
import React, { useEffect } from 'react'
import styles from './ourCourseBanner.module.scss';
import { useSearchParams } from 'next/navigation';
import { useAnimate, useInView } from 'framer-motion';
const CardImage = '/assets/images/card1.png'
export default function OurCourseBanner({course}) {
    let title = '';
    let description = '';
   if(course === 'live') {
        title = 'Live Online Classes'
        description = 'Join our expert mentors in real-time through interactive online sessions. These live classes create a collaborative environment where you can ask questions, engage in discussions, and learn from both instructors and peers. Stay up-to-date with the latest market trends, trading strategies, and industry insights — all from the comfort of your home.'
   }
   else if(course === 'recorded') {
        title = 'Pre Recorded Courses'
        description = 'Access a library of high-quality, pre-recorded lessons that allow you to learn at your own pace, on your own time. These courses are perfect for self-starters who prefer flexibility and the ability to revisit complex topics whenever needed. Each module is carefully structured to ensure a step-by-step understanding of trading concepts, tools, and strategies.'
   }
   else if(course === 'physical') {
    title = 'In Person Courses'
    description = 'For those who thrive in a traditional classroom setting, our in-person sessions offer a hands-on, immersive learning experience. Meet your mentors face-to-face, participate in live trading simulations, and benefit from personalized guidance in a focused environment. Ideal for learners who prefer direct interaction and real-time feedback.'      
   }
  
   const [scope, animate] = useAnimate();
   const isInView = useInView(scope, { once: true, margin: '-100px' });

   useEffect(() => {
        if (!isInView) return;
        animate([
            ['h2', { opacity: 0, y: 20 }, { duration: 0 }],
            ['p', { opacity: 0, y: 20 }, { duration: 0 }],
            ['img', { opacity: 0, scale: 0.95 }, { duration: 0 }],
            ['h2', { opacity: 1, y: 0 }, { duration: 0.6, ease: 'easeOut', at: 0 }],
            ['p', { opacity: 1, y: 0 }, { duration: 0.6, ease: 'easeOut', at: 0.1 }],
            ['img', { opacity: 1, scale: 1 }, { duration: 0.8, ease: 'easeOut', at: 0.2 }],
        ]);
   }, [isInView, animate]);

    return (
        <div className={styles.ourCourseBanner} ref={scope}>
            <div className='container'>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <h2>
                            {title}
                        </h2>
                        <p>
                            {description}
                        </p>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.image}>
                            <img src={CardImage} alt="CardImage" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
