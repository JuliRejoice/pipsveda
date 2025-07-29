import React from 'react'
import styles from './havequestions.module.scss';
import Input from '@/compoents/input';
import Textarea from '@/compoents/textarea';
import Button from '@/compoents/button';
const ChatIcon = '/assets/icons/chat.svg';
const EmailIcon = '/assets/icons/email-icon.svg';
const CallIcon = '/assets/icons/call.svg';
const LocationIcon = '/assets/icons/location.svg';
export default function Havequestions() {
    return (
        <div className={styles.havequestions}>
            <div className='container'>
                <div className={styles.text}>
                    <h2>Have Questions? Let's Talk.</h2>
                    <p>
                        Get in touch with our team for personalized guidance
                    </p>
                </div>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.blockBox}>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={ChatIcon} alt='ChatIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Live Chat / WhatsApp
                                    </h3>
                                    <p>
                                        Available 24/7 for instant support
                                    </p>
                                    <a href='callto:+91 98765 43210' aria-label='+91 98765 43210'>
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={EmailIcon} alt='EmailIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Email
                                    </h3>
                                    <p>
                                        For detailed inquiries
                                    </p>
                                    <a href='callto:support@PipsVedatrading.com' aria-label='support@PipsVedatrading.com'>
                                        support@PipsVedatrading.com
                                    </a>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={CallIcon} alt='CallIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Phone
                                    </h3>
                                    <p>
                                        Call us during business hours
                                    </p>
                                    <a href='callto:+91 98765 43210' aria-label='+91 98765 43210'>
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={LocationIcon} alt='LocationIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Location
                                    </h3>
                                    <p>
                                        For offline programs
                                    </p>
                                    <a aria-label='Mumbai, Maharashtra'>
                                        Mumbai, Maharashtra
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.colGrid}>
                            <Input label='First Name' placeholder='Enter your first name'/>
                            <Input label='Last Name' placeholder='Enter your last name'/>
                            <Input label='Email' placeholder='your.email@example.com'/>
                            <Input label='Phone Number' placeholder='+91 9999999999'/>
                            <div className={styles.lastCol}>
                                <Input label='Subject' placeholder='Subject'/>
                            </div>
                        </div>
                        <Textarea label="Message" placeholder="Tell us more about your trading goals or questions..."/>
                    <div className={styles.buttonAlignment}>
                        <Button text="Send Message"/>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
