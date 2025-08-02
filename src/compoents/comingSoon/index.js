import React from 'react'
import styles from './comingSoon.module.scss';
const CommingSoonImage = '/assets/images/coming-soons.png';
export default function ComingSoon() {
  return (
    <div className={styles.comingSoon}>
      <div className={styles.imageCenter}>
        <img src={CommingSoonImage} alt="CommingSoonImage"/>
      </div>
    </div>
  )
}
