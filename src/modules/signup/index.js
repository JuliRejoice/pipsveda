'use client'
import React, { useState } from 'react'
import styles from './signup.module.scss';
import Input from '@/compoents/input'
import Logo from '@/compoents/logo'
import Button from '@/compoents/button'
import Authentication from '@/compoents/authentication'
import Link from 'next/link';
import { sign } from 'crypto';
import { signUp } from '@/compoents/api/auth';
import { useRouter } from 'next/navigation';
const RightIcon = '/assets/icons/right-lg.svg';
const EyeIcon = '/assets/icons/eye.svg';
export default function Signup() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const router = useRouter();
    const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', submit: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateName = (value) => {
        if (!value) return "Name is required.";
        if (value.length < 2) return "Name must be at least 2 characters.";
        return "";
    };
    const validateEmail = (value) => {
        if (!value) return "Email is required.";
        const re = /^\S+@\S+\.\S+$/;
        if (!re.test(value)) return "Enter a valid email address.";
        return "";
    };
    const validatePassword = (value) => {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        return "";
    };
    const validateConfirmPassword = (value, password) => {
        if (!value) return "Confirm Password is required.";
        if (value !== password) return "Passwords do not match.";
        return "";
    };

    const handleSignup = () => {
        const nameError = validateName(data.name);
        const emailError = validateEmail(data.email);
        const passwordError = validatePassword(data.password);
        const confirmPasswordError = validateConfirmPassword(data.confirmPassword, data.password);
        const newErrors = {
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
            submit: ''
        };
        setErrors(newErrors);
        if (nameError || emailError || passwordError || confirmPasswordError) {
            return;
        }
        setIsSubmitting(true);
        signUp({ name: data.name, email: data.email, password: data.password })
            .then((response) => {
                setIsSubmitting(false);
                setErrors({ name: '', email: '', password: '', confirmPassword: '', submit: '' });
                router.push('/signin');
            })
            .catch((error) => {
                setIsSubmitting(false);
                setErrors((prev) => ({ ...prev, submit: error?.message || "Signup failed. Please try again." }));
            });
    };
    
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
                            <Input name="name" type="text" label='Name' placeholder='Enter your name' value={data.name} onChange={(e) => {
                                setData({ ...data, name: e.target.value });
                                setErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
                            }} />
                            {errors.name && <div className={styles.error}>{errors.name}</div>}
                        </div>
                        <div className={styles.inputAlignment}>
                            <Input name="email" type="email" label='Email Address' placeholder='Enter your email' value={data.email} onChange={(e) => {
                                setData({ ...data, email: e.target.value });
                                setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                            }} />
                            {errors.email && <div className={styles.error}>{errors.email}</div>}
                        </div>
                        <div className={styles.inputAlignment}>
                            <Input name="password" type="password" label='Password' icon={EyeIcon} placeholder='Enter your password' value={data.password} onChange={(e) => {
                                setData({ ...data, password: e.target.value });
                                setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value), confirmPassword: validateConfirmPassword(data.confirmPassword, e.target.value) }));
                            }} />
                            {errors.password && <div className={styles.error}>{errors.password}</div>}
                        </div>
                        <Input name="confirmPassword" type="password" label='Confirm Password' icon={EyeIcon} placeholder='Enter your confirm password' value={data.confirmPassword} onChange={(e) => {
                            setData({ ...data, confirmPassword: e.target.value });
                            setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(e.target.value, data.password) }));
                        }} />
                        {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
                        <div className={styles.forgotPassword}>
                            <Link href="/reset-password" aria-label='reset-password'>Forgot password?</Link>
                        </div>
                        {errors.submit && <div className={styles.error}>{errors.submit}</div>}
                        <div className={styles.buttonWidthFull} onClick={isSubmitting ? undefined : handleSignup} >
                            <Button text={isSubmitting ? "Logging in..." : "Sign Up"} icon={RightIcon} disabled={isSubmitting || !!errors.name || !!errors.email || !!errors.password || !!errors.confirmPassword} />
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
