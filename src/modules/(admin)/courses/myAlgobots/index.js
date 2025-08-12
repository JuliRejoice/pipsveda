import React from 'react'
import styles from './myAlgobots.module.scss';
import Button from '@/compoents/button';
import DateIcon from '@/icons/dateIcon';
import DownloadIcon from '@/icons/downloadIcon';
export default function MyAlgobots() {
  return (
    <div className={styles.myAlgobots}>
      <div className={styles.cardgrid}>
        {
            [...Array(3)].map(()=> {
                return(
                     <div className={styles.cardgridItems}>
            <Button text="Pending Setup"/>
            <div className={styles.twoContentAlignment}>
                <div>
                    <p>Scalping Master Pro</p>
                    <span>High-Frequency Scalping</span>
                </div>
                <div className={styles.dateShow}>
                    <DateIcon/>
                    <span>
                        08/08/2025
                    </span>
                </div>
            </div>
            <div className={styles.alltextStyle}>
                <div>
                    <p>
                        Return
                    </p>
                    <span>+15.8%</span>
                </div>
                <div>
                    <p>
                        Win Rate
                    </p>
                    <span>78%</span>
                </div>
                <div>
                    <p>
                        Trades
                    </p>
                    <span>145</span>
                </div>
            </div>
            <div className={styles.downloadContent}>
                <DownloadIcon/>
                <span>Download Now</span>
            </div>
        </div>
                )
            })
        }
      </div>
    </div>
  )
}
