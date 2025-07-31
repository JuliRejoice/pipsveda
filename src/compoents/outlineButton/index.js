import React from 'react'
import styles from './outlineButton.module.scss';
export default function OutlineButton({ text, icon , onClick }) {
    return (
        <div className={styles.button}>
            <div className={styles.btnwrapper}>
                <button aria-label={text} onClick={onClick}>
                    {text}
                    {
                        icon && (
                            <img src={icon} alt="icon" />
                        )
                    }
                </button>
            </div>
        </div>
    )
}
