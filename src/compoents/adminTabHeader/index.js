'use client'
import React, { useState } from 'react'
import styles from './adminTabHeader.module.scss';
import Logo from '../logo';
import MenuIcon from '@/icons/menuIcon';
import Sidebar from '../sidebar';
import classNames from 'classnames';
export default function AdminTabHeader() {
    const [ toogle , setToogle ] = useState(false);
    return (
        <>
            <div className={styles.adminHeader}>
                <Logo />
                <div className={styles.menu} onClick={() => setToogle(!toogle)}>
                    <MenuIcon />
                </div>
            </div>
            <div className={ classNames(styles.adminSidebarTab , toogle ? styles.show : styles.hide) }>
                <Sidebar toogle={toogle} setToogle={setToogle} />
            </div>
        </>
    )
}
