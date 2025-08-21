import React from 'react'
import styles from './logo.module.scss';
const PipsVedaLogo = '/assets/logo/logo.png';
export default function Logo() {
  return (
    <div className={styles.logo}>
        <img src={PipsVedaLogo} alt='PipsVedaLogo'/>
    </div>
  )
}
