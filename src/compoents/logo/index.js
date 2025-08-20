import React from 'react'
import styles from './logo.module.scss';
import Link from 'next/link';
const PipsVedaLogo = '/assets/logo/logo.png';
export default function Logo() {
  return (
    <Link href="/" aria-label='logo'>
      <div className={styles.logo}>
        <img src={PipsVedaLogo} alt='PipsVedaLogo' />
      </div>
    </Link>
  )
}
