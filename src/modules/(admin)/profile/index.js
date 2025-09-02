'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from './profile.module.scss';
import Breadcumbs from '../breadcumbs';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
import { getCookie, setCookie } from '../../../../cookie';
import { editProfile } from '@/compoents/api/auth';
import toast from 'react-hot-toast';
import Dropdownarrow from '@/icons/dropdownarrow';
import { regions } from '@/regions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';

// Register the English (GB) locale
registerLocale('en-GB', enGB);

const RightIcon = '/assets/icons/right.svg';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [birthDate, setBirthDate] = useState(null);

    // dropdown states
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+12');
    const [selectedGender, setSelectedGender] = useState('');

    const countryRef = useRef(null);
    const genderRef = useRef(null);
    useEffect(() => {
        const userData = getCookie("user");
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
    
        // Birthdate
        if (parsedUser?.birthday) {
            setBirthDate(new Date(parsedUser.birthday));
        }
    
        // Country Code
        if (parsedUser?.countryCode) {
            setSelectedCountryCode(parsedUser.countryCode);
        }
    
        // Gender
        if (parsedUser?.gender) {
            setSelectedGender(parsedUser.gender);
        }
    }, []);
    
    
    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (countryRef.current && !countryRef.current.contains(e.target)) {
                setShowCountryDropdown(false);
            }
            if (genderRef.current && !genderRef.current.contains(e.target)) {
                setShowGenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const validateUser = () => {
        if (!user.name || !user.phone || !user.location || !user.gender || !birthDate) {
            return false;
        }
        return true;
    };

    const handleEditProfile = async () => {
        if (validateUser()) {
            const payload = {
                ...user,
                phone: user.phone, // only the phone number
                countryCode: selectedCountryCode, // separate field
                gender: selectedGender || user.gender,
                birthday: birthDate ? birthDate.toISOString().split('T')[0] : ''
            };
    
            const res = await editProfile(user._id, payload);
    
            if (res.success) {
                setCookie("user", JSON.stringify(res.payload));
                toast.success("Profile updated successfully");
            }
        } else {
            toast.error("Please fill in all fields");
        }
    };
    

    return (
        <div className={styles.profilePageAlignment}>
            <Breadcumbs />
            <div className={styles.profileBox}>
                <div className={styles.cardHeader}>
                    <h2>Edit Profile</h2>
                    <p>
                        Update your personal information, contact details, and preferences to keep your profile up to date.
                    </p>
                </div>

                <div className={styles.subbox}>
                    <div className={styles.grid}>
                        <Input type="text" name="name" label='First Name' placeholder='Enter your first name'
                            value={user?.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })} />

                        {/* Country code + phone */}
                        <div className={styles.telephoninputmain}>
                            <div className={styles.dropdownrelative} ref={countryRef}>
                                <label>Phone</label>
                                <div className={styles.telephoninput}>
                                    <div className={styles.countrycodeselectormain}>
                                        <div className={styles.countrycodeselectorrelative}>
                                            <div
                                                className={styles.countrycodeselector}
                                                onClick={() => setShowCountryDropdown(prev => !prev)}
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
                                        value={user?.phone}
                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Input type="text" name="location" label='Address' placeholder='Enter your location'
                            value={user?.location}
                            onChange={(e) => setUser({ ...user, location: e.target.value })} />

                        {/* Gender dropdown */}
                        <div className={styles.dropdownrelative} ref={genderRef}>
                            <div className={styles.dropdownhead}>
                                <label>Gender</label>
                                <div
                                    className={styles.dropdowninput}
                                    onClick={() => setShowGenderDropdown(prev => !prev)}
                                >
                                    <div className={styles.dropdownselecteditem}>
                                        <span>{selectedGender || "Select Gender"}</span>
                                    </div>
                                    <div className={styles.dropdownarrow}><Dropdownarrow /></div>
                                </div>
                            </div>

                            {showGenderDropdown && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownSpacing}>
                                        {["Male", "Female", "Other"].map((gender) => (
                                            <div
                                                className={styles.iconText}
                                                key={gender}
                                                onClick={() => {
                                                    setSelectedGender(gender);
                                                    setUser({ ...user, gender });
                                                    setShowGenderDropdown(false);
                                                }}
                                            >
                                                <span>{gender}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.datePickerWrapper}>
                            <label>Date of Birth</label>
                            <DatePicker
                                selected={birthDate}
                                onChange={(date) => setBirthDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select date of birth"
                                className={`${styles.datePickerInput} date-picker-custom`}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                maxDate={new Date()}
                                locale="en-GB"
                            />
                        </div>

                    </div>

                    <Button text="Save" icon={RightIcon} onClick={handleEditProfile} />
                </div>
            </div>
        </div>
    )
}
