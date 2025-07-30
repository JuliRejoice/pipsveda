import React from 'react'
import styles from './input.module.scss';
export default function Input({name, type, label, placeholder, icon , onChange}) {  
  return (
    <div className={styles.input}>
      <label>{label}</label>
      <div className={styles.relative}>
        <input type={type} name={name} placeholder={placeholder} onChange={onChange} />
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
