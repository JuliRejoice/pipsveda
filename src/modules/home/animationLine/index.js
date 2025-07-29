import React from 'react'
import styles from './animationLine.module.scss';
import Marquee from "react-fast-marquee";
const WhiteStarIcon = '/assets/icons/white-star.svg';
const StarIcon = '/assets/icons/primary-star.svg';
export default function AnimationLine() {
    return (
        <div className={styles.animationline}>
            <div className={styles.firstLine}>
                <Marquee>
                    {
                        [...Array(30)].map(() => {
                            return (
                                <div className={styles.iconText}>
                                    <img src={WhiteStarIcon} alt='WhiteStarIcon' />
                                    <span>Master Forex Trading</span>
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
                                    <span>Master Forex Trading</span>
                                </div>
                            )
                        })
                    }
                </Marquee>
            </div>
        </div>
    )
}
