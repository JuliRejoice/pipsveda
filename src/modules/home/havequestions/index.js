'use client';
import React, { useEffect, useState } from 'react'
import styles from './havequestions.module.scss';
import Input from '@/compoents/input';
import Textarea from '@/compoents/textarea';
import Button from '@/compoents/button';
import { contactUs } from '@/compoents/api/contact';
import toast from 'react-hot-toast';
import { getUtilityData } from '@/compoents/api/dashboard';

const ChatIcon = '/assets/icons/chat.svg';
const EmailIcon = '/assets/icons/email-icon.svg';
const CallIcon = '/assets/icons/call.svg';
const LocationIcon = '/assets/icons/location.svg';

const validateEmail = (email) => {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return re.test(String(email));
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
    const [utilityData, setUtilityData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!form.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }
        if (!form.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!form.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!form.phone) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!validatePhone(form.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        if (!form.subject.trim()) {
            newErrors.subject = 'Subject is required';
            isValid = false;
        }
        if (!form.description.trim()) {
            newErrors.description = 'Message is required';
            isValid = false;
        }
        console.log("newErrors", newErrors)
        setErrors(newErrors);
        return isValid;
    };

    console.log("errors", errors)

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

        // Validate the form
        const isValid = validateForm();

        if (!isValid) {
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
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchutilityData = async () => {
            try {
                const response = await getUtilityData();
                setUtilityData(response.payload);
            } catch (error) {
                console.error('Error fetching footer data:', error);
            }
        };
        fetchutilityData();
    }, []);

    console.log("utilityData", utilityData)

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
                                    <a href={`callto:${utilityData?.chatNumber}`} aria-label={utilityData?.chatNumber}>
                                        {utilityData?.chatNumber}
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
                                    <a href={`mailto:${utilityData?.email}`} aria-label={utilityData?.email}>
                                        {utilityData?.email}
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
                                    <a href={`callto:${utilityData?.phoneNo}`} aria-label={utilityData?.phoneNo}>
                                        {utilityData?.phoneNo}
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
                                    <a aria-label={utilityData?.location}>
                                        {utilityData?.location}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.colGrid}>
                            <div className={styles.inputAlignment}>
                                <Input
                                    type='text'
                                    name='firstName'
                                    label='First Name'
                                    placeholder='Enter your first name'
                                    value={form.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}

                                />
                                {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
                            </div>
                            <div className={styles.inputAlignment}>
                                <Input
                                    type='text'
                                    name='lastName'
                                    label='Last Name'
                                    placeholder='Enter your last name'
                                    value={form.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                />
                                {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
                            </div>
                            <div className={styles.inputAlignment}>
                                <Input
                                    type='email'
                                    name='email'
                                    label='Email'
                                    placeholder='your.email@example.com'
                                    value={form.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                                {errors.email && <p className={styles.error}>{errors.email}</p>}
                            </div>
                            <div className={styles.inputAlignment}>
                                <Input
                                    type='tel'
                                    name='phone'
                                    label='Phone Number'
                                    placeholder='9876543210'
                                    value={form.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                            </div>
                            <div className={styles.lastCol}>
                                <Input
                                    type='text'
                                    name='subject'
                                    label='Subject'
                                    placeholder='Subject'
                                    value={form.subject}
                                    onChange={(e) => handleChange('subject', e.target.value)}
                                />
                                {errors.subject && <p className={styles.error}>{errors.subject}</p>}
                            </div>
                        </div>
                        <Textarea
                            name='description'
                            label='Message'
                            placeholder='Tell us more about your trading goals or questions...'
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                        {errors.description && <p className={styles.error}>{errors.description}</p>}
                        <div className={styles.buttonAlignment}>
                            <Button
                                type='submit'
                                text={isSubmitting ? (
                                    " Sending..."
                                ) : 'Send Message'}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
