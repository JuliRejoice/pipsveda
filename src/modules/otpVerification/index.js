'use client'
import React, { useEffect, useState } from 'react';
import styles from './otpVerification.module.scss';
import Button from '@/compoents/button';
import Link from 'next/link';
import { forgetPassword, verifyOtp } from '@/compoents/api/auth';
import { useRouter } from 'next/navigation';

const RightIcon = '/assets/icons/right-lg.svg';

export default function OtpVerification() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const router = useRouter();



    useEffect(() => {
        // Get email from URL state when component mounts
        const emailFromState = localStorage.getItem('email');
        if (emailFromState) {
            setEmail(emailFromState);
        }
    }, []);
    console.log(window.location)
    
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setError(null);
        setIsVerifying(true);
        
        try {
            const data = await verifyOtp({ otp: otpString, email });
            if (data && data.success) {
                console.log(data)
                router.push('/new-password');
            } else {
                setError(data?.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            setError(error.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = () => {
        setIsResending(true);
        setError(null);
        
        forgetPassword({ email })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Password reset error:', error);
                setError('Failed to resend OTP. Please try again.');
            })
            .finally(() => {
                setIsResending(false);
            });
    };

    const maskedEmail = email ? `${email.substring(0, 2)}${'*'.repeat(5)}${email.substring(email.indexOf('@') - 1)}` : 'your email';

    return (
        <div className={styles.otpVerification}>
            <div className='container'>
                <div className={styles.signinBox}>
                    <div className={styles.text}>
                        <h2>OTP Verification</h2>
                        <p>Enter OTP Code sent to {maskedEmail}.</p>
                    </div>
                    <div className={styles.inputBoxAlignment}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type='number'
                                id={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                maxLength={1}
                                className={styles.otpInput}
                            />
                        ))}
                    </div>
                    {error && <span className={styles.error}>{error}</span>}
                    <div className={styles.otpCode}>
                        <p>Didn't receive OTP code?</p>
                    </div>
                    <div className={styles.dontHaveAccount}>
                        <p onClick={!isResending ? handleResendOtp : undefined}>
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </p>
                    </div>
                    <div className={styles.leftRightAlignment}>
                        <div className={styles.buttonWidthFull} onClick={!isVerifying ? handleVerifyOtp : undefined}>
                                <Button 
                                    text={isVerifying ? 'Verifying...' : 'Continue'} 
                                    icon={isVerifying ? null : RightIcon} 
                                    disabled={isVerifying}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
