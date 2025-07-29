import React from 'react'
import styles from './outlineButton.module.scss';
export default function OutlineButton({ text, icon }) {
    return (
        <div className={styles.button}>
            <div className={styles.btnwrapper}>
                <button aria-label={text}>
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
