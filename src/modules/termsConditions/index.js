import React from 'react'
import styles from './termsConditions.module.scss';
import CommonBanner from '@/compoents/commonBanner';
const VecIcon = '/assets/icons/aerrow-new.svg';

export default function TermsConditions() {
    return (
        <div>
            <CommonBanner 
                title='Terms & Conditions' 
                description='Please read the terms and conditions before using PipsVeda services including the AlgoBot, courses, Telegram community, and payment system.' 
            />
            <div className={styles.termsConditions}>
                <div className='container'>
                    <div className={styles.content}>
                        <h2>Introduction</h2>
                        <p>
                            Welcome to PipsVeda — a platform designed for traders who want to enhance their skills and automate strategies with advanced tools. Our platform provides algorithmic trading bots (AlgoBots), curated educational courses, real-time trade signals through Telegram, and seamless payment gateways for smooth transactions. By accessing or using our services, you agree to abide by the following terms and conditions.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Summary of Terms & Services</h2>
                        <p>
                            PipsVeda offers a comprehensive ecosystem for traders, including automated trading solutions, training resources, and community engagement. Users are expected to use the platform responsibly and ethically.
                        </p>

                        <h3>1. AlgoBot Usage:</h3>
                        <p>
                            Our AlgoBots are built for educational and trading enhancement purposes. While they help automate strategies, you are responsible for monitoring bot performance and making trading decisions. PipsVeda is not liable for financial losses incurred due to bot actions.
                        </p>

                        <h3>2. Course Access:</h3>
                        <p>
                            Access to courses is granted upon successful payment. Users are prohibited from redistributing or sharing course material. PipsVeda reserves the right to revoke access for any misuse.
                        </p>

                        <h3>3. Telegram Community:</h3>
                        <p>
                            Our Telegram groups provide trade signals, market insights, and community discussions. Any abusive behavior, spamming, or unauthorized promotions will lead to immediate removal from the group.
                        </p>

                        <h3>4. Payment Policy:</h3>
                        <p>
                            All payments made through PipsVeda's platform are secure and processed through trusted gateways. Payments are non-refundable unless otherwise stated under a specific plan or promotional offer.
                        </p>

                        <h3>5. Data Privacy:</h3>
                        <p>
                            We collect only essential information (such as name, email, and payment details) for account creation and access to services. Your data is protected and not shared with third parties without consent.
                        </p>

                        <h3>6. Limitations of Liability:</h3>
                        <p>
                            While we strive to offer high-quality services, PipsVeda is not responsible for technical outages, third-party tool failures (like exchange APIs), or market volatility affecting user trades.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>How We Use Your Information</h2>
                        <p>
                            PipsVeda uses your data to deliver services, offer personalized content, and communicate updates about courses, promotions, and AlgoBot performance. You can opt out of promotional emails at any time. We do not sell your personal data to third parties.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Cookie & Tracking Policy</h2>

                        <h3>1. Essential Cookies</h3>
                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Core Functionality</h4>
                        </div>
                        <p>
                            These cookies ensure our platform functions smoothly — from logging in to accessing course materials or interacting with the AlgoBot dashboard.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Performance Monitoring</h4>
                        </div>
                        <p>
                            We use analytics tools to track usage and improve platform performance. No personally identifiable information is collected through these tools.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Marketing & Retargeting</h4>
                        </div>
                        <p>
                            With your permission, we may use cookies and pixels to show relevant offers and updates across third-party platforms such as Facebook or Google.
                        </p>

                        <h3>2. Disclosure of Information</h3>
                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Third-Party Tools</h4>
                        </div>
                        <p>
                            We may integrate third-party tools (e.g., payment processors or analytics providers) to enhance functionality. These services follow their own privacy policies and compliance standards.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Do Not Track</h4>
                        </div>
                        <p>
                            Currently, we do not respond to Do Not Track (DNT) signals as there is no industry-standard interpretation for these signals yet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}