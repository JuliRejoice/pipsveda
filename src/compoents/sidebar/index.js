'use client'
import React, { useEffect, useState } from 'react'
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
import CloseIcon from '@/icons/closeIcon';
import SignoutIcon from '@/icons/signoutIcon';
import { getCookie, removeCookie } from '../../../cookie';
import { usePathname, useRouter } from 'next/navigation';
const SidebarLayer = '/assets/images/sidebar-layer.png';
const LogoutIcon = '/assets/icons/logout.svg';
const DownIcon = '/assets/icons/down-white.svg';

export default function Sidebar({ setToogle, toogle }) {
    const [user, setUser] = useState(null);
    const [dropdown, setDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState('');
    const router = useRouter();
    const pathname=usePathname();

    const handleTabClick = (tab) => {
        const goTo = '/' + tab;
        router.replace(goTo);
        setActiveSubTab('');
        setToogle(false);
    };

    const handleSubTabClick = (subTab) => {
     
        setActiveSubTab(subTab);
        setToogle(false);
    };

    const handleLogout = () => {
        removeCookie('userToken');
        router.push('/signin');
    }
    useEffect(() => {
        const user = getCookie('user');
        const userName = (user?.name && JSON.parse(user)?.name);
        setUser(userName);
    }, []);

    return (
        <div className={styles.stickyBar}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLayer}>
                    <img src={SidebarLayer} alt='SidebarLayer' />
                </div>
                <div className={styles.logo}>
                    <Logo />
                    <div className={styles.close} onClick={() => setToogle(false)}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.sidebarBody}>
                    <div
                        className={`${styles.menu} ${pathname === '/dashboard' ? styles.active : ''}`}
                        onClick={() => { handleTabClick('dashboard') }}
                    >
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </div>
                    <div className={styles.relative}>
                        <div
                            className={`${styles.menu} ${pathname === '/course' || pathname === '/pre-recorded' ? styles.active : ''}`}
                            onClick={() => setDropdown(!dropdown)}
                        >
                            <CourseIcon />
                            <div className={styles.contentAlignment}>
                                <span>Course</span>
                                <div className={dropdown ? styles.toogle : ''} onClick={(e) => {
                                    e.stopPropagation();
                                    setDropdown(!dropdown);
                                }}>
                                    <DownArrow />
                                </div>
                            </div>
                        </div>
                        <div className={classNames(styles.dropdown, dropdown ? styles.show : styles.hide)}>
                            <div className={styles.dropdownAlignment}>
                                <span
                                    className={pathname === '/pre-recorded' ? styles.activeSubTab : ''}
                                    onClick={() => handleSubTabClick('pre-recorded')}
                                >
                                    Pre-Recorded
                                </span>
                                <span
                                    className={pathname === '/live-online' ? styles.activeSubTab : ''}
                                    onClick={() => handleSubTabClick('live-online')}
                                >
                                    Live Online
                                </span>
                                <span
                                    className={pathname === '/in-person' ? styles.activeSubTab : ''}
                                    onClick={() => handleSubTabClick('in-person')}
                                >
                                    In-Person
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${styles.menu} ${pathname === '/contact-us' ? styles.active : ''}`}
                        onClick={() => {
                            handleTabClick('contact-us');
                        }}
                    >
                        <ContactUs />
                        <span>Contact Us</span>
                    </div>
                </div>
                <div className={styles.sidebarFooter}>
                    <div className={styles.relativeDiv}>
                        <div onClick={() => setProfileDropdown(!profileDropdown)} className={classNames(styles.buttonDeisgn, profileDropdown ? styles.iconRotate : "")}>
                            <button>
                                {user ?? "User"}
                                <img src={DownIcon} alt="DownIcon" />
                            </button>
                        </div>
                        <div className={classNames(styles.dropdown, profileDropdown ? styles.show : styles.hide)}>
                            <div className={styles.dropdownSpacing}>
                                <div className={styles.iconText}>
                                    <ProfileI />
                                    <span>Profile</span>
                                </div>
                                <div className={styles.iconText}>
                                    <SettingsIcon />
                                    <span>Settings</span>
                                </div>
                                <div className={styles.iconText} onClick={handleLogout}>
                                    <SignoutIcon />
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
