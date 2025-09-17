import React from 'react'
import styles from './logo.module.scss';
const PipsVedaLogo = '/assets/logo/logo.png';
export default function Logo({logo}) {
  return (
    <div className={styles.logo}>
        <img src={logo || PipsVedaLogo} alt='PipsVedaLogo'/>
    </div>
  )
}
