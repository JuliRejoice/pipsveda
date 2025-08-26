import React from 'react';
import styles from './refundPolicy.module.scss';
import CommonBanner from '@/compoents/commonBanner';
const VecIcon = '/assets/icons/vec-icon.svg';

export default function RefundPolicy() {
    return (
        <div>
            <CommonBanner 
                title='Refund Policy' 
                description='This Refund Policy outlines the terms for requesting refunds on digital services including AlgoBot, trading courses, and Telegram signal subscriptions provided by PipsVeda.' 
            />
            <div className={styles.refundPolicy}>
                <div className='container'>
                    <div className={styles.content}>
                        <h2>Introduction</h2>
                        <p>
                            At PipsVeda, we provide digital products and services such as algorithmic trading tools (AlgoBot), educational courses, and Telegram-based community access. Due to the digital and consumable nature of these products, our refund policies are tailored to ensure fairness to both our users and platform. Please read the terms below carefully before purchasing any plan or service.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Refund Eligibility</h2>

                        <h3>1. AlgoBot Subscriptions</h3>
                        <p>
                            Refunds for AlgoBot subscriptions are only issued if requested within 3 days of the initial purchase and only if the service has not been actively used. Usage includes setting up trades, connecting APIs, or accessing trade performance data. After this period, no refunds will be processed.
                        </p>

                        <h3>2. Trading Courses</h3>
                        <p>
                            Courses provided through PipsVeda are non-refundable once access has been granted. This is due to the instant access to downloadable materials, video lessons, and proprietary strategies. We encourage users to review course previews or outlines before purchasing.
                        </p>

                        <h3>3. Telegram Signal Groups</h3>
                        <p>
                            Access to Telegram signal channels is delivered immediately after payment. Since this is a consumable subscription, no refunds are provided after access is granted. Please evaluate your readiness before subscribing to any plan.
                        </p>

                        <h3>4. Bundle Offers</h3>
                        <p>
                            Packages that include a combination of services (e.g. AlgoBot + Course + Telegram) are non-refundable if any component of the bundle has been used or accessed.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Payment Disputes</h2>
                        <p>
                            If you believe your account was charged incorrectly or you were billed without authorization, please contact our support team immediately at <strong>support@pipsveda.com</strong>. Filing a chargeback without contacting us first may result in permanent suspension of your PipsVeda account and denial of future service access.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Refund Process</h2>
                        <p>
                            If your request qualifies for a refund:
                            <ul>
                                <li>Send an email with your registered account details and reason for the refund</li>
                                <li>Allow up to 7 business days for processing</li>
                                <li>Refunds will be issued to the original payment method only</li>
                            </ul>
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Exceptions & Non-Refundable Situations</h2>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Change of Mind</h4>
                        </div>
                        <p>
                            Refunds will not be issued simply for a change of mind or dissatisfaction with performance that results from user misuse or unrealistic expectations.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Partial Use of Services</h4>
                        </div>
                        <p>
                            If a user has partially used any service — for example, accessing a portion of a course or enabling AlgoBot — a refund will not be processed.
                        </p>

                        <div className={styles.iconText}>
                            <img src={VecIcon} alt='VecIcon' />
                            <h4>Promotional or Discounted Plans</h4>
                        </div>
                        <p>
                            Services purchased using discount codes, promo offers, or seasonal deals are non-refundable unless stated otherwise during the promotion.
                        </p>
                    </div>

                    <div className={styles.content}>
                        <h2>Contact Us</h2>
                        <p>
                            For any refund-related queries or disputes, please contact us at <strong>support@pipsveda.com</strong>. Our team is available Monday to Friday and aims to respond within 2 working days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}