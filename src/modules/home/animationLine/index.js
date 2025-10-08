import React from 'react'
import styles from './animationLine.module.scss';
import Marquee from "react-fast-marquee";
const WhiteStarIcon = '/assets/icons/white-star.svg';
const StarIcon = '/assets/icons/primary-star.svg';
export default function AnimationLine() {
    return (
        <div className={styles.animationlinemain}>
            <div className={styles.animationline}>
                <div className={styles.firstLine}>
                    <Marquee>
                        {
                            [...Array(30)].map(() => {
                                return (
                                    <div className={styles.iconText}>
                                        <img src={WhiteStarIcon} alt='WhiteStarIcon' />
                                        <span>Forex Trading</span>
                                        <img src={WhiteStarIcon} alt='WhiteStarIcon' />
                                        <span>Stock Trading</span>
                                        <img src={WhiteStarIcon} alt='WhiteStarIcon' />
                                        <span>Commodity Trading</span>
                                        <img src={WhiteStarIcon} alt='WhiteStarIcon' />
                                        <span>Futures Trading</span>
                                        <img src={WhiteStarIcon} alt='WhiteStarIcon' />
                                        <span>Options Trading</span>
                                    </div>
                                )
                            })
                        }
                    </Marquee>
                </div>
                <div className={styles.secLine}>
                    <Marquee>
                        {
                            [...Array(30)].map(() => {
                                return (
                                    <div className={styles.iconText}>
                                        <img src={StarIcon} alt='StarIcon' />
                                        <span>Forex Trading</span>
                                        <img src={StarIcon} alt='StarIcon' />
                                        <span>Stock Trading</span>
                                        <img src={StarIcon} alt='StarIcon' />
                                        <span>Commodity Trading</span>
                                        <img src={StarIcon} alt='StarIcon' />
                                        <span>Futures Trading</span>
                                        <img src={StarIcon} alt='StarIcon' />
                                        <span>Options Trading</span>
                                    </div>
                                )
                            })
                        }
                    </Marquee>
                </div>
            </div>
        </div>
    )
}
