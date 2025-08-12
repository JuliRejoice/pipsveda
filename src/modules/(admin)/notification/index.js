import React from 'react'
import styles from './notification.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Button from '@/compoents/button';
import ClockIcon from '@/icons/clockIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import DownloadIcon from '@/icons/downloadIcon';
export default function Notification() {
    return (
        <div>
            <AdminHeader />
            <div className={styles.notificationBox}>
                <div className={styles.title}>
                    <h2>
                        Notification
                    </h2>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </p>
                </div>
                <div className={styles.allBoxAlignment}>
                    {
                        [...Array(4)].map((_, i) => {
                            return (
                                <div className={styles.box} key={i}>
                                    <div className={styles.leftContentAlignment}>
                                        <Button text="Urgent" />
                                        <div className={styles.content}>
                                            <h3>
                                                AlgoBot Package Ready
                                            </h3>
                                            <p>
                                                Your purchased "Forex Scalping Bot" package is now ready for download
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.rightContentAlignment}>
                                        <div className={styles.clock}>
                                            <ClockGreyIcon />
                                            <span>2 minutes ago</span>
                                        </div>
                                        <div className={styles.downloadiconText}>
                                            <DownloadIcon />
                                            <span>Download Now</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
