'use client'
import React, { useEffect, useState } from 'react'
import styles from './footer.module.scss';
import Logo from '../logo';
import FacebookIcon from '@/icons/facebookIcon';
import TwitterIcon from '@/icons/twitterIcon';
import IinstagramIcon from '@/icons/instagramIcon';
import LinkdinIcon from '@/icons/linkdinIcon';
import InstagramIcon from '@/icons/instagramIcon';
import Button from '../button';
import { createNewsLetter, getUtilityData } from '../api/dashboard';
import Link from 'next/link';
import toast from 'react-hot-toast';
const FooterImage = '/assets/images/footer-bg.png';
export default function Footer() {
    const [footerData, setFooterData] = useState([]);
    const [email, setEmail] = useState('');

    const validateEmail = (email) => {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validateEmail(email)) {
                toast.error('Please enter a valid email address');
                return;
            }
            const response = await createNewsLetter({ email });
            if (response.success) {
                toast.success('Newsletter Subscribed Successfully.');
                setEmail('');
            }
        } catch (error) {
            console.error('Error creating newsletter:', error);
            toast.error('Failed to create newsletter');
        }
    };
    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await getUtilityData();
                setFooterData(response.payload);
            } catch (error) {
                console.error('Error fetching footer data:', error);
            }
        };
        fetchFooterData();
    }, []);


    return (
        <div>
            <footer className={styles.footer}>
                <div className='container'>
                    <div className={styles.grid}>
                        <div className={styles.gridItems}>
                            <Logo logo={'/assets/logo/logo-white.png'}/>
                            <div className={styles.mainText}>
                                <p>
                                    Empowering traders with knowledge, community
                                    and proven strategies for lasting financial success.
                                </p>
                            </div>
                            <div className={styles.socialIcon}>
                                <Link target='_blank' href={footerData?.facebookLink || ''}>
                                    <div>
                                        <FacebookIcon />
                                    </div>
                                </Link>
                                <Link target='_blank' href={footerData?.twitter || ''}>
                                    <div>
                                        <TwitterIcon /> 
                                    </div>
                                </Link>
                                <Link target='_blank' href={footerData?.instagramLink || ''}>
                                    <div>
                                        <InstagramIcon />
                                    </div>
                                </Link>
                                <Link target='_blank' href={footerData?.linkedin || ''}>
                                    <div>
                                        <LinkdinIcon />
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.gridItems}>
                            <h3>Quick Links</h3>
                            <div className={styles.alllinealignment}>
                                <div className={styles.line}></div>
                                <div className={styles.line}></div>
                                <div className={styles.line}></div>
                            </div>
                            <div className={styles.menu}>
                                <a href="/about" aria-label='About'>About</a>
                                <a href="/our-course" aria-label='Courses'>Courses</a>
                                <a href="/blog" aria-label='Blog'>Blog</a>
                                {/* <a href="/contact" aria-label='Contact'>Contact</a> */}
                                <a href="/faq" aria-label='FAQ'>FAQ</a>
                            </div>
                        </div>
                        <div className={styles.gridItems}>
                            <h3>Support</h3>
                            <div className={styles.alllinealignment}>
                                <div className={styles.line}></div>
                                <div className={styles.line}></div>
                                <div className={styles.line}></div>
                            </div>
                            <div className={styles.menu}>
                                <a href="/terms-conditions"aria-label='Terms of Service'>Terms of Service</a>
                                <a href="/privacy-policy" aria-label='Privacy Policy'>Privacy Policy</a>
                                {/* <a href="/telegram-group" aria-label='Telegram Group'>Telegram Group</a> */}
                                <a href="/refund-policy" aria-label='Refund Policy'>Refund Policy</a>
                            </div>
                        </div>
                        <div className={styles.gridItems}>
                            <h3>
                                Subscribe to Newsletter
                            </h3>
                            <div className={styles.text}>
                                <p>
                                    Get Monthly insights from founders around the globe. No
                                    spam - promise.
                                </p>
                            </div>
                            <div className={styles.inputRelative}>
                                <input type='text' placeholder='Enter your Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                                <div className={styles.buttonRight}>
                                    <Button text="Subscribe" onClick={handleSubmit} />
                                </div>
                            </div>
                            {/* <div className={styles.checkboxText}>
                                <input type='checkbox' />
                                <label>I agree to the Privacy Policy</label>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className={styles.footerBg}>
                    <img src={FooterImage} alt='FooterImage' />
                </div>
            </footer>
            <div className={styles.copright}>
                <div className='container'>
                    <p>
                        © 2025 Pips Veda. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
