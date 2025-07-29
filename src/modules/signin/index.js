import React from 'react'
import styles from './signin.module.scss'
import Input from '@/compoents/input'
import Logo from '@/compoents/logo'
export default function Signin() {
    return (
        <div className={styles.signinBanner}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.logoAlignment}>
                        <Logo />
                    </div>
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
                        <Input label='Password' placeholder='Enter your password' />
                        <div className={styles.forgotPassword}>
                            <a>Forgot password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
