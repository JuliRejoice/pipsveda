'use client'
import React, { useEffect, useState } from 'react'
import styles from './arbitrageAlgo.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getAlgobot } from '@/compoents/api/algobot';
import { useRouter } from 'next/navigation';
const RightBlackIcon = '/assets/icons/right-black.svg';
const CardImage = '/assets/images/crypto.png';

export default function ArbitrageAlgo() {
    const [algobotData, setAlgobotData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchAlgobotData = async () => {
            try {
                const response = await getAlgobot();
                setAlgobotData(response.payload.data);
            } catch (error) {
                console.error('Error fetching algobot data:', error);
            }
        };
        fetchAlgobotData();
    }, []);

    return (
        <div className={styles.arbitrageAlgoAlignment}>
            <div className={styles.title}>
                <h2>Arbitrage Algo</h2>
            </div>
            <div className={styles.grid}>
                {
                    algobotData?.map((item, i) => {
                        return (
                            <div className={styles.griditems} key={i}>
                                <div className={styles.image}>
                                    <img
                                        src={CardImage} alt="CardImage" />
                                </div>
                                <div className={styles.details}>
                                    <h3>{item.botName}</h3>
                                    <p>{item.description}</p>
                                    <div className={styles.twoColgrid}>
                                        <div className={styles.items}>
                                            <div className={styles.contentAlignment}>
                                                <span>6 months</span>
                                                <h4>$200</h4>
                                            </div>
                                            <div className={styles.contentAlignment}>
                                                <span>M.R.P :</span>
                                                <h5>$200</h5>
                                            </div>
                                            <div className={styles.contentAlignment}>
                                                <span>Discount :</span>
                                                <h5 className={styles.dangerText}>-0%</h5>
                                            </div>
                                        </div>
                                        <div className={styles.items}>
                                            <div className={styles.contentAlignment}>
                                                <span>6 months</span>
                                                <h4>$200</h4>
                                            </div>
                                            <div className={styles.contentAlignment}>
                                                <span>M.R.P :</span>
                                                <h5>$200</h5>
                                            </div>
                                            <div className={styles.contentAlignment}>
                                                <span>Discount :</span>
                                                <h5 className={styles.dangerText}>-0%</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <OutlineButton
                                        text="Enroll Now"
                                        icon={RightBlackIcon}
                                        onClick={() => router.push(`/algobot/${item._id}`)}
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
