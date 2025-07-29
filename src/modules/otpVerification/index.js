import React from 'react'
import styles from './otpVerification.module.scss';
import Button from '@/compoents/button';
import Link from 'next/link';
const RightIcon  = '/assets/icons/right-lg.svg';
export default function OtpVerification() {
  return (
     <div className={styles.otpVerification}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.text}>
                        <h2>OTP Verification</h2>
                        <p>
                          Enter OTP Code sent to ju******78@gmail.com.
                        </p>
                    </div>
                    <div className={styles.inputBoxAlignment}>
                        <input type='number'/>
                        <input type='number'/>
                        <input type='number'/>
                        <input type='number'/>
                        <input type='number'/>
                        <input type='number'/>
                    </div>
                    <div className={styles.otpCode}>
                        <p>Don't recieve OTP code?</p>
                    </div>
                     <div className={styles.dontHaveAccount}>
                          <p>
                            Resend Code
                          </p>
                        </div>
                    <div className={styles.leftRightAlignment}>
                       
                        <div className={styles.buttonWidthFull}>
                            <Link aria-label='otp-verification' href="/otp-verification">
                                <Button text="Continue" icon={RightIcon}/>
                            </Link>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
  )
}
