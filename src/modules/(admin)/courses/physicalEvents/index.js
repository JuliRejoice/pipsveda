import React from 'react'
import styles from './physicalEvents.module.scss';
import DownloadPrimaryIcon from '@/icons/downloadPrimaryIcon';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import DateIcon from '@/icons/dateIcon';
import MenIcon from '@/icons/menIcon';
import Button from '@/compoents/button';
import DownloadIcon from '@/icons/downloadIcon';
export default function PhysicalEvents() {
    return (
        <div className={styles.physicalEventsAlignment}>
            <div className={styles.cardgrid}>
                {
                    [...Array(3)].map((_, i) => {
                        return (
                            <div className={styles.cardgridItems} key={i}>
                                <Button text="Upcoming" />
                                <div className={styles.content}>
                                    <h3>Hands-on Blockchain Workshop</h3>
                                    <div className={styles.icontext}>
                                        <MenIcon />
                                        <span>Hands-on Blockchain Workshop</span>
                                    </div>
                                </div>
                                <div className={styles.textgrid}>
                                    <div className={styles.textgridItems}>
                                        <h4>Location</h4>
                                        <p>
                                            TechHub Center, 123 Technology Blvd, Suite 456 San Francisco, 
                                            CA 94105
                                        </p>
                                    </div>
                                    <div className={styles.textgridItems}>
                                        <h4>
                                            Schedule
                                        </h4>
                                        <p>
                                            Tuesday, August 20, 2024
                                        </p>
                                        <div className={styles.clockText}>
                                            <ClockGreyIcon/>    
                                            <p>09:15</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.downlodIcon}>
                                    <DownloadIcon/>    
                                    <span>Download Details</span>
                                </div>
                                
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
