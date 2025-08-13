'use client'
import React, { useEffect, useState } from 'react'
import styles from './algobotDetails.module.scss';
import Breadcumbs from '@/modules/(admin)/breadcumbs';
import Button from '@/compoents/button';
import { getAlgobot } from '@/compoents/api/algobot';
const RightIcon = '/assets/icons/right.svg';

function AlgobotDetails({id}) {
    const [algobotData, setAlgobotData] = useState([]);
    const fetchAlgobotData = async () => {
        try {
            const response = await getAlgobot(id);
            console.log("🚀 ~ fetchAlgobotData ~ response:", response)
            setAlgobotData(response.payload.data[0]);
        } catch (error) {
            console.error('Error fetching algobot data:', error);
        }
    };
    useEffect(() => {
        fetchAlgobotData();
    }, []);

    console.log("🚀 ~ AlgobotDetails ~ algobotData:", algobotData);
    return (
        <div>
            <Breadcumbs />
            <div className={styles.algobotDetailsAlignment}>
                <div className={styles.pageHeaderAlignment}>
                    <div className={styles.text}>
                        <h2>{algobotData?.botName}</h2>
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
                        <p>{algobotData?.description}</p>
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

export default AlgobotDetails;