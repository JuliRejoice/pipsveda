import React from 'react'
import styles from './textarea.module.scss';

export default function Textarea({ label, placeholder, value, onChange }) {
  return (
    <div className={styles.textarea}>
      <label>{label}</label>
      <textarea 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  )
}
