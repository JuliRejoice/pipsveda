import React from 'react'
import styles from './arbitrageAlgo.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
const RightBlackIcon = '/assets/icons/right-black.svg';
const CardImage = '/assets/images/crypto.png';

export default function ArbitrageAlgo() {
    return (
        <div className={styles.arbitrageAlgoAlignment}>
            <div className={styles.title}>
                <h2>Arbitrage Algo</h2>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(4)].map((_, i) => {
                        return (
                            <div className={styles.griditems} key={i}>
                                <div className={styles.image}>
                                    <img
                                        src={CardImage} alt="CardImage" />
                                </div>
                                <div className={styles.details}>
                                    <h3>Core (Manual Arbitrage)</h3>
                                    <p>Best for Beginner</p>
                                    <div className={styles.twoContent}>
                                        <div className={styles.text}>
                                            <span>6 months</span>
                                            <h5>$200</h5>
                                        </div>
                                        <div className={styles.text}>
                                            <span>1 months</span>
                                            <h5>$50</h5>
                                        </div>
                                    </div>
                                    <OutlineButton
                                        text="Enroll Now"
                                        icon={RightBlackIcon}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
