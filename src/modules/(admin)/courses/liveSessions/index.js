import React from 'react'
import styles from './liveSessions.module.scss';
import Button from '@/compoents/button';
import MenIcon from '@/icons/menIcon';
import DownloadPrimaryIcon from '@/icons/downloadPrimaryIcon';
import DateIcon from '@/icons/dateIcon';
import ClockIcon from '@/icons/clockIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import PlayIcon from '@/icons/playIcon';
export default function LiveSessions() {
    return (
        <div className={styles.liveSessionsAlignment}>
            <div className={styles.cardgrid}>
                {
                    [...Array(3)].map((_, i) => {
                        return (
                            <div className={styles.cardgridItems} key={i}>
                                <Button text="Upcoming" />
                                <div className={styles.content}>
                                    <h3>Live Trading Masterclass</h3>
                                    <div className={styles.icontext}>
                                        <MenIcon />
                                        <span>Michael Rodriguez</span>
                                    </div>
                                </div>
                                <div className={styles.bottomContentAlignment}>
                                    <div className={styles.nextsession}>
                                        <p>Next Live Session</p>
                                        <div className={styles.twoIconTextAlignment}>
                                            <div className={styles.textIcon}>
                                                <DateIcon />
                                                <span>08/08/2025</span>
                                            </div>
                                            <div className={styles.textIcon}>
                                                <ClockGreyIcon />
                                                <span>02:15</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.mettingContent}>
                                        <DownloadPrimaryIcon />
                                        <span>Get Meeting Link</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.title}>
                <h2>
                    Previous Recordings
                </h2>
            </div>
            <div className={styles.sessionGrid}>
                {
                    [...Array(3)].map((_,i) => {
                        return (
                            <div className={styles.sessionGridItems} key={i}>
                                <div className={styles.content}>
                                    <h3>
                                        Session 01: Market Opening Strategies
                                    </h3>
                                    <div className={styles.twoIcontext}>
                                        <div className={styles.iconText}>
                                            <DateIcon />
                                            <span>08/08/2025</span>
                                        </div>
                                        <div className={styles.iconText}>
                                            <ClockGreyIcon />
                                            <span>02:15</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.watchText}>
                                    <PlayIcon />
                                    <span>Watch</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
