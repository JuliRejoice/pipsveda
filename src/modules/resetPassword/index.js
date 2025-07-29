import React from 'react'
import styles from './resetPassword.module.scss';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
import Link from 'next/link';
const RightIcon  = '/assets/icons/right-lg.svg';

export default function ResetPassword() {
  return (
       <div className={styles.resetPassword}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.text}>
                        <h2>Reset Your Password</h2>
                        <p>
                            We’ll send you an email to reset your password.
                        </p>
                    </div>
                    <div className={styles.leftRightAlignment}>
                        <div className={styles.inputAlignment}>
                            <Input label='Email Address' placeholder='Enter your email' />
                        </div>
                        <div className={styles.buttonWidthFull}>
                            <Link aria-label='otp-verification' href="/otp-verification">
                                <Button text="Continue" icon={RightIcon}/>
                            </Link>
                        </div>
                        <div className={styles.dontHaveAccount}>
                            <p>Back to <Link aria-label='signup' href="/signin">Sign in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
