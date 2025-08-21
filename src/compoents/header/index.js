'use client'
import React, { useEffect, useState } from 'react'
import styles from './header.module.scss';
import Logo from '../logo';
import Button from '../button';
import classNames from 'classnames';
import MenuIcon from '@/icons/menuIcon';
import CloseIcon from '@/icons/closeIcon';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
const RightIcon = '/assets/icons/right.svg';
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const course = searchParams.get("course");
  return (
    <>
      <header className={classNames(
        styles.header,
        scrollDirection === 'downToTop'
          ? styles.show
          : scrollDirection === 'noScroll'
            ? null
            : styles.hide
      )} >
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

              <a aria-label='Community'>AlgoBots</a>
              <a aria-label='Resources'>Resources</a>
              <a aria-label='Blog'>Blog</a>
              <a aria-label='About Us'>About Us</a>
            </div>
            <div className={styles.buttonDesign}>
              <Link href="/signin">
                <Button text="Login" icon={RightIcon} />
              </Link>
            </div>
            <div className={styles.menuIcon} onClick={() => setHeader(!header)}>
              <MenuIcon />
            </div>
          </div>


        </div>
      </header>
      <div className={classNames(styles.mobileHeader, header ? styles.show : styles.hide)}>
        <div className={styles.mobileSmHeader}>
          <Logo />
          <div onClick={() => setHeader(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.mobileBody}>
          <a href="/our-course" aria-label='Courses'>Courses</a>
          <a href="/our-course" aria-label='Live Online Classes'>Live Online Classes</a>
          <a href="/our-course" aria-label='Offline Sessions'>Offline Sessions</a>
          <a href="/algotbots" aria-label='Community'>AlgoBots</a>
          <a href="/resources" aria-label='Resources'>Resources</a>
          <a href="/blog" aria-label='Blog'>Blog</a>
          <a aria-label='About Us'>About Us</a>
        </div>
        <div className={styles.mobileFooter}>
          <Button text="Login" icon={RightIcon} />
        </div>
      </div>
    </>
  )
}
