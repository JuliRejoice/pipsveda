'use client'
import React, { useState } from 'react'
import styles from './resetPassword.module.scss';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
import Link from 'next/link';
import { forgetPassword } from '@/compoents/api/auth';
import { useRouter } from 'next/navigation';

const RightIcon = '/assets/icons/right-lg.svg';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
   
    const handleReset = () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        forgetPassword({ email })
            .then((data) => {
                localStorage.setItem('email', email);
                router.push('/otp-verification');
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
                        <div className={styles.buttonWidthFull} onClick={handleReset}>
                            <Button 
                                text={isLoading ? 'Sending...' : 'Continue'} 
                                icon={isLoading ? null : RightIcon}
                                disabled={isLoading}
                                showLoader={isLoading}
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
