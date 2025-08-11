import React from 'react'
import styles from './algobotDetails.module.scss';
import Breadcumbs from '@/modules/(admin)/breadcumbs';
import Button from '@/compoents/button';
const RightIcon = '/assets/icons/right.svg';
export default function AlgobotDetails() {
    return (
        <div>
            <Breadcumbs />
            <div className={styles.algobotDetailsAlignment}>
                <div className={styles.pageHeaderAlignment}>
                    <div className={styles.text}>
                        <h2>Core (Manual Arbitrage)</h2>
                        <p>
                            The Core Plan is designed for beginners looking to dive into Spot Future Difference (CFD) trading. It offers a practical foundation with a focus on real-time trading experiences. Key Features: Beginner-Friendly: Tailored for newcomers, simplifying complex trading concepts for
                            accessible learning.
                        </p>
                    </div>
                    <div>
                        <div className={styles.twoTextAlignment}>
                            <div className={styles.text}>
                                <span>6 months</span>
                                <h5>$200</h5>
                            </div>
                            <div className={styles.text}>
                                <span>1 months</span>
                                <h5>$50</h5>
                            </div>
                        </div>
                        <div className={styles.rightButton}>
                            <Button text="Enroll Now" icon={RightIcon} />
                        </div>
                    </div>
                </div>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.box}></div>
                    </div>
                    <div className={styles.griditems}>
                        <p>
                            Real-Time Trading: Engage in live market scenarios, allowing you to practice making
                            trades confidently.
                        </p>
                        <p>
                            Zero Risk Experience: Utilize manual algorithms for a risk-free trading
                            environment, encouraging experimentation without financial loss.
                        </p>
                        <p>
                            Comprehensive Curriculum: Cover essential topics, including market fundamentals, trading strategies, and risk management. Supportive Community: Join a network of
                            fellow beginners to share experiences and learn collaboratively.
                        </p>
                        <p>
                            Conclusion: The Core Plan is the ideal starting point for anyone interested in Spot Future Difference trading. Gain the confidence and skills needed to succeed in the financial markets while enjoying a supportive and risk-free learning environment. Start your trading journey today! Comprehensive Curriculum: Cover essential topics, including market fundamentals, trading strategies, and risk management. Supportive Community: 
                            Join a network of fellow beginners to share experiences and learn collaboratively.
                        </p>
                    </div>
                </div>
                <div className={styles.tutorial}>
                    <h3>Tutorial</h3>
                    <div className={styles.textdropdown}>
                        <p>
                            Select your preferred language :
                        </p>
                        <select>
                            <option>English</option>
                            <option>English</option>
                            <option>English</option>
                        </select>
                    </div>
                </div>
                <div className={styles.tutorialVideo}>
                    <div className={styles.subBox}></div>
                </div>
            </div>
        </div>
    )
}
