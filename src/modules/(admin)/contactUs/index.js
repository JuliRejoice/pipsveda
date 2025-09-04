'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './contactUs.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Input from '@/compoents/input';
import Textarea from '@/compoents/textarea';
import Button from '@/compoents/button';
import { sendMessage } from '@/compoents/api/contactus';
import Dropdownarrow from '@/icons/dropdownarrow';
import { regions } from '@/regions';

import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast';
import { getUtilityData } from '@/compoents/api/dashboard';

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
        countryCode: '',
        phone: '',
        subject: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [utility, setUtility] = useState({})
    const [selectedCountryCode, setSelectedCountryCode] = useState('91');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const countryRef = useRef(null);

    useEffect(() => {
        const fetchUtility = async () => {
            try {
                const response = await getUtilityData();
                setUtility(response.payload || {});
            } catch (error) {
                console.error('Error fetching utility:', error);
                toast.error('Failed to load utility');
            }
        };
        fetchUtility();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        // Normalize email by trimming and converting to lowercase
        const normalizedEmail = form.email.trim().toLowerCase();
        if (!normalizedEmail) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            newErrors.email = 'Invalid email';
        }
        
        // Phone number validation (numbers only, 8-15 digits)
        if (!form.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{8,15}$/.test(form.phone)) {
            newErrors.phone = 'Please enter a valid phone number (8-15 digits)';
        }
        
        if (!form.subject.trim()) newErrors.subject = 'Subject is required';
        if (!form.description.trim()) newErrors.description = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        // Prevent leading/trailing spaces for all fields
        if (typeof value === 'string') {
            value = field === 'phone' 
                ? value.replace(/\D/g, '') // Remove non-digits for phone
                : value.trimStart(); // Only trim start for other fields to allow spaces in between
        }
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Trim all string fields before validation
        const trimmedForm = {
            ...form,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim().toLowerCase(),
            subject: form.subject.trim(),
            description: form.description.trim()
        };
        
        setForm(trimmedForm);
        const isValid = validate();
        if (!isValid) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await sendMessage(form);
            if (response.success) {
                toast.success('Your message has been sent successfully!');
                setForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    countryCode: '',
                    subject: '',
                    description: ''
                });
            } else {
                toast.error('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
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
                            <div>
                                <Input
                                    label='First Name'
                                    placeholder='Enter your first name'
                                    value={form.firstName}
                                    onChange={e => handleChange('firstName', e.target.value)}
                                />
                                {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                            </div>
                            <div>
                                <Input
                                    label='Last Name'
                                    placeholder='Enter your last name'
                                    value={form.lastName}
                                    onChange={e => handleChange('lastName', e.target.value)}
                                />
                                {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                            </div>
                            <div>
                                <Input
                                    label='Email'
                                    placeholder='your.email@example.com'
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                />
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>
                            <div className={styles.telephoninputmain}>
                                <div className={styles.dropdownrelative} ref={countryRef}>
                                    <label>Phone</label>
                                    <div className={styles.telephoninput}>
                                        <div className={styles.countrycodeselectormain}>
                                            <div className={styles.countrycodeselectorrelative}>
                                                <div
                                                    className={styles.countrycodeselector}
                                                    onClick={() => setShowCountryDropdown(prev => !prev)}
                                                    onChange={(e) => handleChange('countryCode', e.target.value)}
                                                >
                                                    <span>{selectedCountryCode}</span>
                                                    <div className={styles.dropdownarrow}><Dropdownarrow /></div>
                                                </div>

                                                {showCountryDropdown && (
                                                    <div className={styles.dropdown}>
                                                        <div className={styles.dropdownSpacing}>
                                                            {regions.map((region) => (
                                                                <div
                                                                    className={styles.iconText}
                                                                    key={region.code}
                                                                    onClick={() => {
                                                                        setSelectedCountryCode(region.numberCode);
                                                                        handleChange("countryCode", region.numberCode);
                                                                        setShowCountryDropdown(false);
                                                                      }}
                                                                    
                                                                      
                                                                >
                                                                    <span>{region.numberCode}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder='Enter your number'
                                            value={form.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className={styles.fullwidth}>
                                <Input
                                    label='Subject'
                                    placeholder='How can we help you?'
                                    value={form.subject}
                                    onChange={e => handleChange('subject', e.target.value)}
                                />
                                {errors.subject && <span className={styles.error}>{errors.subject}</span>}
                            </div>
                        </div>
                        <div>
                            <Textarea
                                label='Message'
                                placeholder='Tell us more about your trading goals or questions...'
                                value={form.description}
                                onChange={e => handleChange('description', e.target.value)}
                            />
                            {errors.description && <span className={styles.error}>{errors.description}</span>}
                        </div>
                        <div className={styles.btnAlignment}>
                            <Button text="Send Message" icon={RightIcon} disabled={isSubmitting} onClick={handleSubmit} />
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
                                    <a href={`https://wa.me/${utility?.chatNumber?.replace(/[^0-9]/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={utility?.chatNumber}>
                                        {utility?.chatNumber}
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
                                    <a
                                        href={`mailto:${utility?.email ?? ''}`}
                                        aria-label={utility?.email ?? 'Email'}
                                        className="text-blue-500 underline"
                                    >
                                        {utility?.email ?? 'Email not available'}
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
                                    <a href={`callto:${utility?.phoneNo}`} aria-label='+91 98765 43210'>
                                        {utility?.phoneNo}
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
                                        {utility?.location}
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
