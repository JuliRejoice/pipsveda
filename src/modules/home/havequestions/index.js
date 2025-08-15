'use client';
import React, { useState } from 'react'
import styles from './havequestions.module.scss';
import Input from '@/compoents/input';
import Textarea from '@/compoents/textarea';
import Button from '@/compoents/button';
import { contactUs } from '@/compoents/api/contact';
import toast from 'react-hot-toast';

const ChatIcon = '/assets/icons/chat.svg';
const EmailIcon = '/assets/icons/email-icon.svg';
const CallIcon = '/assets/icons/call.svg';
const LocationIcon = '/assets/icons/location.svg';

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

export default function Havequestions() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        description: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!form.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(form.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        
        if (!form.subject.trim()) newErrors.subject = 'Subject is required';
        if (!form.description.trim()) newErrors.description = 'Message is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: '',
            description: ''
        });
        setErrors({});
    };

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            const response = await contactUs(form);
            toast.success('Message sent successfully! We will get back to you soon.');
            resetForm();
            return response;
        } catch (error) {
            console.error('Error during contact:', error);
            toast.error('Failed to send message. Please try again later.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.havequestions}>
            <div className='container'>
                <div className={styles.text}>
                    <h2>Have Questions? Let's Talk.</h2>
                    <p>Get in touch with our team for personalized guidance</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.blockBox}>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={ChatIcon} alt='ChatIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Live Chat / WhatsApp
                                    </h3>
                                    <p>
                                        Available 24/7 for instant support
                                    </p>
                                    <a href='callto:+91 98765 43210' aria-label='+91 98765 43210'>
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={EmailIcon} alt='EmailIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Email
                                    </h3>
                                    <p>
                                        For detailed inquiries
                                    </p>
                                    <a href='callto:support@PipsVedatrading.com' aria-label='support@PipsVedatrading.com'>
                                        support@PipsVedatrading.com
                                    </a>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={CallIcon} alt='CallIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Phone
                                    </h3>
                                    <p>
                                        Call us during business hours
                                    </p>
                                    <a href='callto:+91 98765 43210' aria-label='+91 98765 43210'>
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={LocationIcon} alt='LocationIcon' />
                                </div>
                                <div>
                                    <h3>
                                        Location
                                    </h3>
                                    <p>
                                        For offline programs
                                    </p>
                                    <a aria-label='Mumbai, Maharashtra'>
                                        Mumbai, Maharashtra
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.colGrid}>
                            <Input 
                                type='text' 
                                name='firstName'
                                label='First Name' 
                                placeholder='Enter your first name' 
                                value={form.firstName}
                                onChange={(e)=>handleChange('firstName', e.target.value)}
                                error={errors.firstName}
                            />
                            <Input 
                                type='text' 
                                name='lastName'
                                label='Last Name' 
                                placeholder='Enter your last name' 
                                value={form.lastName}
                                onChange={(e)=>handleChange('lastName', e.target.value)}
                                error={errors.lastName}
                            />
                            <Input 
                                type='email' 
                                name='email'
                                label='Email' 
                                placeholder='your.email@example.com' 
                                value={form.email}
                                onChange={(e)=>handleChange('email', e.target.value)}
                                error={errors.email}
                            />
                            <Input 
                                type='tel' 
                                name='phone'
                                label='Phone Number' 
                                placeholder='9876543210' 
                                value={form.phone}
                                onChange={(e)=>handleChange('phone', e.target.value)}
                                error={errors.phone}
                            />
                            <div className={styles.lastCol}>
                                <Input 
                                    type='text' 
                                    name='subject'
                                    label='Subject' 
                                    placeholder='Subject' 
                                    value={form.subject}
                                    onChange={(e)=>handleChange('subject', e.target.value)}
                                    error={errors.subject}
                                />
                            </div>
                        </div>
                        <Textarea 
                            name='description'
                            label='Message' 
                            placeholder='Tell us more about your trading goals or questions...' 
                            value={form.description}
                            onChange={(e)=>handleChange('description', e.target.value)}
                            // error={errors.description}
                        />
                        <div className={styles.buttonAlignment}>
                            <Button 
                                type='submit'
                                text={isSubmitting ? 'Sending...' : 'Send Message'} 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
