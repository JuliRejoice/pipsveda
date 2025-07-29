import React from 'react'
import styles from './input.module.scss';
export default function Input({ label, placeholder, icon }) {
  return (
    <div className={styles.input}>
      <label>{label}</label>
      <div className={styles.relative}>
        <input type='text' placeholder={placeholder} />
        {
          icon && (
            <div className={styles.iconAlignment}>
              <img src={icon} alt={icon} />
            </div>
          )
        }
      </div>
    </div>
  )
}
