import React from 'react'
import styles from './button.module.scss';
export default function Button({text , icon , onClick , disabled}) {
  return (
    <div className={styles.button}>
      <button aria-label={text} onClick={onClick} disabled={disabled}>
        {text}
        {
          icon && (
            <img src={icon} alt="icon" />
          )
        }
      </button>
    </div>
  )
}
