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
                console.log("🚀 ~ fetchAlgobotData ~ response:", response)
                setAlgobotData(response.payload.data);
            } catch (error) {
                console.error('Error fetching algobot data:', error);
            }
        };
        fetchAlgobotData();
    }, []);

    console.log("🚀 ~ ArbitrageAlgo ~ algobotData:", algobotData)
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
