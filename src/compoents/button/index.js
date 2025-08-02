import React from 'react'
import styles from './button.module.scss';
export default function Button({text , icon , onClick}) {
  return (
    <div className={styles.button}>
      <button aria-label={text} onClick={onClick}>
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
