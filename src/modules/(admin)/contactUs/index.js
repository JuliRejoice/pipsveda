'use client'
import React, { useState } from 'react'
import styles from './contactUs.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Input from '@/compoents/input';
import Textarea from '@/compoents/textarea';
import Button from '@/compoents/button';
import { sendMessage } from '@/compoents/api/contactus';
const ChatIcon = '/assets/icons/chat.svg';
const EmailIcon = '/assets/icons/email-icon.svg';
const CallIcon = '/assets/icons/call.svg';
const LocationIcon = '/assets/icons/location.svg';
const RightIcon = '/assets/icons/right.svg';
export default function ContactUs() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Invalid email';
        }
        if (!form.phone.trim()) newErrors.phone = 'Phone is required';
        if (!form.subject.trim()) newErrors.subject = 'Subject is required';
        if (!form.description.trim()) newErrors.description = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      sendMessage(form);
      
    };

    return (
        <div>
            <AdminHeader />
            <div className={styles.contactUsPage}>
                <div className={styles.textstyle}>
                    <h2>Have Questions? Let's Talk.</h2>
                    <p>Get in touch with our team for personalized guidance</p>
                </div>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.twoColGrid}>
                            <Input
                                label='First Name'
                                placeholder='Enter your first name'
                                value={form.firstName}
                                onChange={e => handleChange('firstName', e.target.value)}
                                error={errors.firstName}
                            />
                            <Input
                                label='Last Name'
                                placeholder='Enter your last name'
                                value={form.lastName}
                                onChange={e => handleChange('lastName', e.target.value)}
                                error={errors.lastName}
                            />
                            <Input
                                label='Email'
                                placeholder='your.email@example.com'
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
                                error={errors.email}
                            />
                            <Input
                                label='Phone Number'
                                placeholder='+91 9999999999'
                                value={form.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                                error={errors.phone}
                            />
                            <div className={styles.fullwidth}>
                                <Input
                                    label='Subject'
                                    placeholder='How can we help you?'
                                    value={form.subject}
                                    onChange={e => handleChange('subject', e.target.value)}
                                    error={errors.subject}
                                />
                            </div>
                        </div>
                        <Textarea
                            label='Message'
                            placeholder='Tell us more about your trading goals or questions...'
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                            error={errors.description}
                        />
                        <div className={styles.btnAlignment} onClick={handleSubmit}>
                            <Button text="Send Message" icon={RightIcon}  />
                        </div>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.whiteBox}>
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
                </div>
            </div>
        </div>
    )
}
