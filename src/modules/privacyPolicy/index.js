import React from 'react';
import styles from './privacyPolicy.module.scss';
import CommonBanner from '@/compoents/commonBanner';
const VecIcon = '/assets/icons/vec-icon.svg';

export default function PrivacyPolicy() {
    return (
        <div>
            <CommonBanner 
                title='Privacy Policy' 
                description='This Privacy Policy outlines how PipsVeda collects, uses, and protects your personal data when you use our services, including the AlgoBot, courses, Telegram channels, and payment systems.' 
            />
            <div className={styles.privacyPolicyAllContentAlignment}>
                <div className='container'>
                    <div className={styles.content}>
                        <h2>Introduction</h2>
                        <p>
                            PipsVeda is committed to safeguarding your personal information. This Privacy Policy describes how we collect, store, and use data when you interact with our platform, access our algorithmic trading tools (AlgoBot), enroll in courses, join Telegram communities, or make payments. By using our services, you agree to the terms outlined in this policy.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Privacy Summary</h2>
                        <p>
                            We collect limited user information necessary for account creation, product delivery, customer support, and legal compliance. We never sell your personal information, and we implement industry-standard encryption and data security measures.
                        </p>

                        <h3>1. Personally Identifiable Information (PII)</h3>
                        <p>
                            We collect data like your full name, email address, contact number, billing address, and payment details when you sign up, make purchases, or enroll in our courses. This data helps us deliver services, verify your identity, and contact you if needed.
                        </p>

                        <h3>2. Usage Data & Analytics</h3>
                        <p>
                            PipsVeda may collect non-identifiable data such as your browser type, operating system, and usage behavior on our website or app. This helps us improve platform performance and tailor user experiences.
                        </p>

                        <h3>3. Telegram & Community Data</h3>
                        <p>
                            When you join our Telegram groups, we may store your username and interaction history to moderate discussions and deliver personalized updates or support. We do not collect private messages or share your chat history externally.
                        </p>

                        <h3>4. Payment Information</h3>
                        <p>
                            Payments made through our platform are handled via third-party, PCI-compliant processors. We do not store full credit/debit card numbers or CVV codes on our servers. Billing information may be stored in a secure, tokenized format for future renewals or refunds.
                        </p>

                        <h3>5. Marketing Communication</h3>
                        <p>
                            With your permission, we may send you newsletters, product announcements, or course updates via email or Telegram. You can opt out at any time using the unsubscribe link in emails or by adjusting your preferences in your account settings.
                        </p>

                        <h3>6. Information Sharing</h3>
                        <p>
                            Your data is only shared with trusted third-party services (like payment gateways, CRM tools, or email platforms) as needed to operate PipsVeda. We do not sell or rent your personal information to any third party.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>How We Use Your Information</h2>
                        <p>
                            The data we collect enables us to:
                            <ul>
                                <li>Provide access to AlgoBot tools and performance dashboards</li>
                                <li>Enroll you in trading courses and track your progress</li>
                                <li>Invite and manage your access to our Telegram groups</li>
                                <li>Process payments securely</li>
                                <li>Send transactional and promotional communications</li>
                                <li>Improve our platform and personalize your experience</li>
                            </ul>
                            We retain your data only as long as it is necessary for legal or business purposes.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Cookies & Tracking Technologies</h2>

                        <h3>1. Types of Cookies We Use</h3>
                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Essential Cookies</h4>
                        </div>
                        <p>
                            Required for you to log in, view course content, and interact with AlgoBot functionalities. Disabling these may affect your experience.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Analytics Cookies</h4>
                        </div>
                        <p>
                            Used to track user behavior and improve site features and user flow. These cookies do not contain any personal identifiers.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Marketing Cookies</h4>
                        </div>
                        <p>
                            May be used to deliver personalized ads across platforms like Google and Facebook, based on your activity on PipsVeda.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Third-Party Pixels</h4>
                        </div>
                        <p>
                            Pixel tags and similar technologies help us understand user journeys and campaign effectiveness, without storing personal information.
                        </p>

                        <h3>2. Disclosure of Information</h3>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Legal Compliance</h4>
                        </div>
                        <p>
                            We may disclose user data to comply with applicable laws, governmental requests, legal processes, or enforce our terms of service.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Do Not Track Signals</h4>
                        </div>
                        <p>
                            Our site currently does not respond to DNT browser signals, but you may disable tracking via cookie settings or browser preferences.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Data Deletion Requests</h4>
                        </div>
                        <p>
                            You can request account deletion or data export by contacting our support team at <strong>support@pipsveda.com</strong>. We will respond within 14 business days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}