'use client'
import React, { useEffect, useState, useContext, useRef } from 'react'
import styles from './header.module.scss';
import Logo from '../logo';
import Button from '../button';
import classNames from 'classnames';
import MenuIcon from '@/icons/menuIcon';
import CloseIcon from '@/icons/closeIcon';
import UserIcon from '@/icons/userIcon';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { getCookie, removeCookie } from '../../../cookie';
import ProfileIcon from '@/icons/profileIcon';
import toast from 'react-hot-toast';
const DownIcon = "/assets/icons/down-white.svg";
const RightIcon = '/assets/icons/right.svg';
const LogoutIcon = "/assets/icons/logout.svg";

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("noScroll");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const updateScrollDirection = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "topToDown" : "downToTop";
      if (currentScrollTop === 0) {
        setScrollDirection("noScroll");
      } else if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
}

export default function Header() {
  const scrollDirection = useScrollDirection();
  const [header, setHeader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const user = getCookie("user");



  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const course = searchParams.get("course");

  const handleLogout = async () => {
    try {
      removeCookie("userToken");
      removeCookie("user");
      toast.success("Logout successfully.");
      router.push('/signin');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both dropdown button and dropdown menu
      const isClickInside = 
        event.target.closest(`.${styles.userDropdown}`) || 
        (dropdownRef.current && dropdownRef.current.contains(event.target));
      
      if (!isClickInside) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className={classNames(
        styles.header,
        scrollDirection === 'downToTop'
          ? styles.show
          : scrollDirection === 'noScroll'
            ? null
            : styles.hide
      )}>
        <div className='container'>
          <div className={styles.headerDesign}>
            <a href='/'><Logo /></a>
            <div className={styles.menu}>
              <a
                className={course === 'recorded' ? styles.active : ''}
                href="/our-course?course=recorded"
                aria-label="Courses"
              >
                Courses
              </a>
              <a
                className={course === 'live' ? styles.active : ''}
                href="/our-course?course=live"
                aria-label="Live Online Classes"
              >
                Live Online Classes
              </a>
              <a
                className={course === 'physical' ? styles.active : ''}
                href="/our-course?course=physical"
                aria-label="Offline Sessions"
              >
                Offline Sessions
              </a>
              <a href="/algobots" className={pathname === ('/algobots' || '/algobot-details') ? styles.active : ''} aria-label='Community'>AlgoBots</a>
              <a href="/blog" className={pathname === '/blog' ? styles.active : ''} aria-label='Blog'>Blog</a>
              <a aria-label='About Us'>About Us</a>
            </div>

            <div className={styles.buttonDesign}>
              {user ? (
                <div className={styles.userDropdown}>
                  <button
                    className={styles.userButton}
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-label="User menu"
                  >
                    <UserIcon />
                    <span>{user.displayName?.split(' ')[0] || 'User'}</span>
                    <img src={DownIcon} alt="DownIcon" />
                  </button>
                </div>
              ) : (
                <Link href="/signin">
                  <Button text="Login" icon={RightIcon} />
                </Link>
              )}
            </div>

            <div className={styles.menuIcon} onClick={() => setHeader(!header)}>
              <MenuIcon />
            </div>
          </div>
        </div>
      </header>

      {/* {dropdown wrapper} */}
      <div className={classNames(
        styles.dropdownwrapper,
        scrollDirection === 'downToTop'
          ? styles.show
          : scrollDirection === 'noScroll'
            ? null
            : styles.hide
      )}>
        <div className='container'>
          <div className={styles.profiledropdownrelative}>
            {showDropdown && (
              <div className={styles.dropdownMenu} ref={dropdownRef}>
                <Link className={styles.dropdownItem} href="/profile"><ProfileIcon /> Profile</Link>
                <div className={styles.dropdownhr}></div>
                <button
                  onClick={handleLogout}
                  className={classNames(styles.dropdownItem, styles.logoutButton)}
                >
                  <img src={LogoutIcon} alt='LogoutIcon' />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={classNames(styles.mobileHeader, header ? styles.show : styles.hide)}>
        <div className={styles.mobileSmHeader}>
          <Logo />
          <div onClick={() => setHeader(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.mobileBody}>
          <a href="/our-course?course=recorded">Courses</a>
          <a href="/our-course?course=live">Live Online Classes</a>
          <a href="/our-course?course=physical">Offline Sessions</a>
          <a href="/algotbots">AlgoBots</a>
          <a href="/blog">Blog</a>
          <a href="#">About Us</a>
        </div>
        <div className={styles.mobileFooter}>
          {user ? (
            <>
              <Link href="/profile">
                <Button text="Profile" />
              </Link>
              <Button text="Logout" onClick={handleLogout} />
            </>
          ) : (
            <Link href="/signin">
              <Button text="Login" icon={RightIcon} />
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
