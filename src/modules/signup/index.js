import React from 'react'
import styles from './signup.module.scss';
import Input from '@/compoents/input'
import Logo from '@/compoents/logo'
import Button from '@/compoents/button'
import Authentication from '@/compoents/authentication'
import Link from 'next/link';
const RightIcon = '/assets/icons/right-lg.svg';
const EyeIcon = '/assets/icons/eye.svg';
export default function Signup() {
    return (
        <div className={styles.signup}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.text}>
                        <h2>Create Your Free Account</h2>
                        <p>
                            Start learning from industry experts and grow your financial skills.
                        </p>
                    </div>
                    <div className={styles.leftRightAlignment}>
                        <div className={styles.inputAlignment}>
                            <Input label='Full Name' placeholder='Enter your name' />
                        </div>
                        <div className={styles.inputAlignment}>
                            <Input label='Email Address' placeholder='Enter your email' />
                        </div>
                        <div className={styles.inputAlignment}>
                            <Input label='Password' icon={EyeIcon} placeholder='Enter your password' />
                        </div>
                        <Input label='Confirm Password' icon={EyeIcon} placeholder='Enter your confirm password' />
                        <div className={styles.forgotPassword}>
                            <Link href="/reset-password" aria-label='reset-password'>Forgot password?</Link>
                        </div>
                        <div className={styles.buttonWidthFull}>
                            <Button text="Sign Up" icon={RightIcon} />
                        </div>
                        <Authentication />
                        <div className={styles.dontHaveAccount}>
                            <p>Already have an account? <Link aria-label='sign in' href="/signin">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
