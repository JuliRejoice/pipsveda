import React from 'react'
import styles from './footer.module.scss';
import Logo from '../logo';
import FacebookIcon from '@/icons/facebookIcon';
import TwitterIcon from '@/icons/twitterIcon';
import IinstagramIcon from '@/icons/instagramIcon';
import LinkdinIcon from '@/icons/linkdinIcon';
import InstagramIcon from '@/icons/instagramIcon';
import Button from '../button';
const FooterImage = '/assets/images/footer-bg.png';
export default function Footer() {
    return (
        <div>
            <footer className={styles.footer}>
                <div className='container'>
                    <div className={styles.grid}>
                        <div className={styles.gridItems}>
                            <Logo />
                            <div className={styles.mainText}>
                                <p>
                                    Empowering traders with knowledge, community
                                    and proven strategies for lasting financial success.
                                </p>
                            </div>
                            <div className={styles.socialIcon}>
                                <div>
                                    <FacebookIcon />
                                </div>
                                <div>
                                    <TwitterIcon />
                                </div>
                                <div>
                                    <InstagramIcon />
                                </div>
                                <div>
                                    <LinkdinIcon />
                                </div>
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
                                <a aria-label='About'>About</a>
                                <a aria-label='Courses'>Courses</a>
                                <a aria-label='Blog'>Blog</a>
                                <a aria-label='Contact'>Contact</a>
                                <a aria-label='FAQ'>FAQ</a>
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
                                <a aria-label='Terms of Service'>Terms of Service</a>
                                <a aria-label='Privacy Policy'>Privacy Policy</a>
                                <a aria-label='Telegram Group'>Telegram Group</a>
                                <a aria-label='Refund Policy'>Refund Policy</a>
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
                                <input type='text' placeholder='Enter your Email' />
                                <div className={styles.buttonRight}>
                                    <Button text="Subscribe" />
                                </div>
                            </div>
                            <div className={styles.checkboxText}>
                                <input type='checkbox'/>
                                <label>I agree to the Privacy Policy</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBg}>
                    <img src={FooterImage} alt='FooterImage'/>
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
