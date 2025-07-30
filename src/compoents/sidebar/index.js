'use client'
import React, { useState } from 'react'
import styles from './sidebar.module.scss';
import Logo from '../logo';
import DashboardIcon from '@/icons/dashboardIcon';
import CourseIcon from '@/icons/courseIcon';
import DownArrow from '@/icons/downArrow';
import classNames from 'classnames';
import ContactUs from '@/icons/contactUs';
import SettingsIcon from '@/icons/settingsIcon';
import NotificationIcon from '@/icons/notificationIcon';
import ProfileI from '@/icons/profileI';
import CommonButton from '../commonButton';
const SidebarLayer = '/assets/images/sidebar-layer.png';
const LogoutIcon = '/assets/icons/logout.svg';
export default function Sidebar() {
    const [dropdown, setDropdown] = useState(false);
    return (
        <div className={styles.stickyBar}>
        <aside className={styles.sidebar}>
            <div className={styles.sidebarLayer}>
                <img src={SidebarLayer} alt='SidebarLayer'/>
            </div>
            <div className={styles.logo}>
                <Logo />
            </div>
            <div className={styles.sidebarBody}>
                <div className={styles.menu}>
                    <DashboardIcon />
                    <span>Dashboard</span>
                </div>
                <div className={styles.relative}>
                    <div className={styles.menu}>
                        <CourseIcon />
                        <div className={styles.contentAlignment}>
                            <span>Course</span>
                            <div className={dropdown ? styles.toogle : ''} onClick={() => setDropdown(!dropdown)}>
                                <DownArrow />
                            </div>
                        </div>
                    </div>
                    <div className={classNames(styles.dropdown, dropdown ? styles.show : styles.hide)}>
                        <div className={styles.dropdownAlignment}>
                            <span>Pre-Recorded</span>
                            <span>Live Online</span>
                            <span>In-Person</span>
                        </div>
                    </div>
                </div>
                <div className={styles.menu}>
                    <ContactUs />
                    <span>Contact Us</span>
                </div>
                <div className={styles.menu}>
                    <SettingsIcon />
                    <span>Settings</span>
                </div>
                <div className={styles.menu}>
                    <NotificationIcon />
                    <span>Notification</span>
                </div>
                <div className={styles.menu}>
                    <ProfileI />
                    <span>Profile</span>
                </div>
            </div>
            <div className={styles.sidebarFooter}>
                <CommonButton text="Enroll Now" outline icon={LogoutIcon} />
            </div>
        </aside>
</div>
    )
}
