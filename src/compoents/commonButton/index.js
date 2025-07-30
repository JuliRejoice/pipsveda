import React from 'react'
import styles from './commonButton.module.scss';
import classNames from 'classnames';
export default function CommonButton({text , outline , icon}) {
  return (
    <div className={ classNames(styles.commonButton , outline ? styles.outlineButton : "") }>
      <button aria-label={text}>
        {
            icon && (
                <img src={icon} alt={icon}/>
            )
        }
        {text}
        </button>
    </div>
  )
}
