import React from 'react'
import styles from './authentication.module.scss';
const GoogleIcon = '/assets/icons/google-icon.svg';
const FacebookIcon = '/assets/icons/facebook.svg';
const LinkdinIcon = '/assets/icons/linkdin-icon.svg';
export default function Authentication() {
  return (
    <div className={styles.authentication}>
      <div className={styles.whiteButton}>
        <img src={GoogleIcon} alt='GoogleIcon'/>
      </div>
      <div className={styles.whiteButton}>
        <img src={FacebookIcon} alt='FacebookIcon'/>
      </div>
      <div className={styles.whiteButton}>
        <img src={LinkdinIcon} alt='LinkdinIcon'/>
      </div>
    </div>
  )
}
