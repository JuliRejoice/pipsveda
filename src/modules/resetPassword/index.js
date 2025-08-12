'use client'
import React, { useState } from 'react'
import styles from './resetPassword.module.scss';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
import Link from 'next/link';
import { forgetPassword } from '@/compoents/api/auth';
import { useRouter } from 'next/navigation';
import Logo from '@/compoents/logo';
import { toast } from 'react-toastify';
import { errorMessages } from '@/utils/constant';

const RightIcon = '/assets/icons/right-lg.svg';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleReset = () => {
        let regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        if (!regex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError(null);

        forgetPassword({ email })
            .then((data) => {
                console.log(data)
                if(data.success) {
                    localStorage.setItem('email', email);
                    toast.success('OTP sent successfully.');
                    router.push('/otp-verification');
                }
                else{
                    toast.error(errorMessages[data.message] || 'Failed to send reset email. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Password reset error:', error);
                setError(error.message || 'Failed to send reset email. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className={styles.resetPassword}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.logoCenter}>
                        <Logo />
                    </div>
                    <div className={styles.text}>
                        <h2>Reset Your Password</h2>
                        <p>We'll send you an email to reset your password.</p>
                    </div>
                    <div className={styles.leftRightAlignment}>
                        <div className={styles.inputAlignment}>
                            <Input
                                name="email"
                                type="email"
                                label='Email Address'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            {error && <span className={styles.error}>{error}</span>}
                        </div>
                        <div className={styles.buttonWidthFull}>
                            <Button 
                                text={isLoading ? 'Sending...' : 'Continue'} 
                                icon={isLoading ? null : RightIcon}
                                disabled={isLoading}
                                showLoader={isLoading}
                                onClick={handleReset}
                            />
                        </div>
                        <div className={styles.dontHaveAccount}>
                            <p>Back to <Link href="/signin">Sign in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
