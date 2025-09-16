'use client'
import React, { useEffect, useState } from 'react'
import styles from "./watermark.module.scss"
import Marquee from 'react-fast-marquee'
import Logo from '../logo'
import { getCookie } from '../../../cookie'

export default function Watermark() {
    const [user , setUser] = useState({});
    useEffect(() => {
        const userData = getCookie('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    return (
        <>
            <div className={styles.watermarkmain}>
                <div className={styles.watermarkmarqueemain}>
                    <Marquee direction="right">
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.watermarkflx}>
                            <Logo />
                            <p>{user.email}</p>
                        </div>
                    </Marquee>
                </div>
            </div>
        </>
    )
}
