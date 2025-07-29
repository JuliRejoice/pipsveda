import React from 'react'
import styles from './newPassword.module.scss';
import Button from '@/compoents/button';
import Link from 'next/link';
import Input from '@/compoents/input';
const RightIcon  = '/assets/icons/right-lg.svg';
const EyeIcon  = '/assets/icons/eye.svg';

export default function NewPassword() {
  return (
   <div className={styles.newPassword}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.text}>
                        <h2>Set new password</h2>
                    </div>
                    <div className={styles.leftRightAlignment}>
                        <div className={styles.inputAlignment}>
                            <Input label='New Password' placeholder='**************' icon={EyeIcon} />
                        </div>
                            <Input label='Confirm Password' placeholder='daphneSmith@gmail.com' icon={EyeIcon} />
                        <div className={styles.buttonWidthFull}>
                            <Link aria-label='otp-verification' href="/otp-verification">
                                <Button text="Set new password" icon={RightIcon}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
