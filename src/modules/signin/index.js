import React from 'react'
import styles from './signin.module.scss'
import Input from '@/compoents/input'
import Logo from '@/compoents/logo'
import Button from '@/compoents/button'
import Authentication from '@/compoents/authentication'
import Link from 'next/link'
const RightIcon  = '/assets/icons/right-lg.svg';
const EyeIcon  = '/assets/icons/eye.svg';
export default function Signin() {
    return (
        <div className={styles.signinBanner}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.text}>
                        <h2>Welcome Back</h2>
                        <p>
                            Continue your journey into the world of financial mastery.
                        </p>
                    </div>
                    <div className={styles.leftRightAlignment}>
                        <div className={styles.inputAlignment}>
                            <Input label='Email Address' placeholder='Enter your email' />
                        </div>
                        <Input label='Password' icon={EyeIcon} placeholder='Enter your password' />
                        <div className={styles.forgotPassword}>
                            <a>Forgot password?</a>
                        </div>
                        <div className={styles.buttonWidthFull}>
                            <Button text="Sign In" icon={RightIcon}/>
                        </div>
                        <Authentication/>
                        <div className={styles.dontHaveAccount}>
                            <p>Don’t have an account? <Link aria-label='signup' href="/signup">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
