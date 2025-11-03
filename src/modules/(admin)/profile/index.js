'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from './profile.module.scss';
import Breadcumbs from '../breadcumbs';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
import { getCookie, setCookie } from '../../../../cookie';
import { editProfile, getProfile, uploadImage } from '@/compoents/api/auth';
import UserIcon from '@/icons/userIcon';
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
    const [isLoading, setIsLoading] = useState(false);
    const [dateError, setDateError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [initialUserData, setInitialUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const countryRef = useRef(null);
    const genderRef = useRef(null);

    console.log(profileImage)

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const userData = getCookie("user");
        const parsedUser = JSON.parse(userData)._id;
        const response = await getProfile(parsedUser);
        const user = response.payload.data[0];
        console.log(user)
        setUser(user);
        setInitialUserData(user);
        if (user.profileImage) {
            setPreviewImage(user.profileImage);
        }

        // Set birthdate if available
        if (user?.birthday) {
            setBirthDate(new Date(user.birthday));
        }

        // Set country code if available
        if (user?.countryCode) {
            setSelectedCountryCode(user.countryCode);
        }

        // Set gender if available
        if (user?.gender) {
            setSelectedGender(user.gender);
        }
    };


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
        if (!user.name || !user.phone  || !user.gender || !birthDate) {
            return false;
        }
        return true;
    };

    const handleEditProfile = async () => {
        setPhoneError('');
        setDateError('');

        // Phone number validation
        if (!user?.phone || user.phone.length !== 10) {
            setPhoneError('Phone number must be 10 digits');
            return;
        }
        if (!validateUser()) {
            toast.error("Please fill in all fields");
            return;
        }

        // Check if user is at least 13 years old
        const thirteenYearsAgo = new Date();
        thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);

        if (birthDate > thirteenYearsAgo) {
            setDateError('You must be at least 13 years old');
            return;
        }

        if (isLoading) return; // Prevent multiple clicks

        setIsLoading(true);
        try {
            const formData = new FormData();

            // Append all user data to formData
            formData.append('name', user.name?.trim() || '');
            formData.append('phone', user.phone?.trim() || '');
            formData.append('location', user.location || '');
            formData.append('city', user.city || '');
            formData.append('state', user.state || '');
            formData.append('country', user.country || '');
            formData.append('gender', selectedGender || user.gender || '');
            formData.append('countryCode', selectedCountryCode);
            formData.append('birthday', birthDate ? birthDate.toISOString().split('T')[0] : '');

            // Append profile image if selected
            console.log(profileImage)
            if (profileImage) {
                const imageRes = await uploadImage(profileImage);
                formData.append('profileImage', imageRes.payload);
            }

            const res = await editProfile(user._id, formData);

            if (res.success) {
                setCookie("user", JSON.stringify(res.payload));
                toast.success("Profile updated successfully");
                fetchProfile();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const hasChanges = () => {
        if (!initialUserData || !user) return false;

        // Check if any profile field has changed
        const profileFieldsChanged = (
            user.name !== initialUserData.name ||
            user.phone !== initialUserData.phone ||
            user.gender !== initialUserData.gender ||
            user.location !== initialUserData.location ||
            user.city !== initialUserData.city ||
            user.state !== initialUserData.state ||
            user.country !== initialUserData.country ||
            (birthDate && initialUserData.birthday &&
                new Date(birthDate).toISOString().split('T')[0] !== initialUserData.birthday)
        );

        // Check if profile image has changed
        const imageChanged = (
            profileImage !== null || // New image selected
            (previewImage && previewImage !== initialUserData.profileImage) // Preview URL changed
        );

        return profileFieldsChanged || imageChanged;
    };

    return (
        <div className={styles.profilePageAlignment}>
            <Breadcumbs />
            <div className={styles.profileBox}>
                {/* Profile Image Upload */}
              
                <div className={styles.cardHeader}>
                    <h2>Edit Profile</h2>
                    <p>
                        Update your personal information, contact details, and preferences to keep your profile up to date.
                    </p>
                </div>

                  <div className={styles.profileImageContainer}>
                    <div className={styles.profileImageWrapper}>
                        {previewImage ? (
                            <img 
                                src={previewImage} 
                                alt="Profile" 
                                className={styles.profileImage}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                }}
                            />
                        ) : (
                            <div className={styles.userIconWrapper}>
                                <UserIcon />
                            </div>
                        )}
                        <label className={styles.profileImageUpload}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setProfileImage(file);
                                        setPreviewImage(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <span>Edit Photo</span>
                        </label>
                    </div>
                </div>

                <div className={styles.subbox}>
                    <div className={styles.grid}>
                        <Input
                            type="text"
                            name="name"
                            label='First Name'
                            placeholder='Enter your first name'
                            value={user?.name || ''}
                            onChange={(e) => {
                                // Remove leading spaces
                                const value = e.target.value.replace(/^\s+/, '');
                                setUser({ ...user, name: value });
                            }}
                        />
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
                                        type="tel"  // Changed from text to tel for better mobile keyboard
                                        name="phone"
                                        placeholder='Enter your number'
                                        value={user?.phone || ''}
                                        maxLength={10}  // Prevent typing more than 10 digits
                                        onChange={(e) => {
                                            // Only allow numbers and remove any non-digit characters
                                            const value = e.target.value.replace(/\D/g, '');
                                            setUser({ ...user, phone: value });
                                            // Clear error when user starts typing
                                            if (phoneError) {
                                                setPhoneError('');
                                            }
                                        }}
                                    />
                                </div>
                                {phoneError && <span className={styles.errorMessage}>{phoneError}</span>}
                            </div>
                        </div>

                            
                        <Input 
                            type="text" 
                            name="location" 
                            label='Location' 
                            placeholder='Enter your full address'
                            value={user?.location || ''}
                            onChange={(e) => setUser({ ...user, location: e.target.value })} 
                        />

                        <Input 
                            type="text" 
                            name="city" 
                            label='City' 
                            placeholder='Enter your city'
                            value={user?.city || ''}
                            onChange={(e) => setUser({ ...user, city: e.target.value })} 
                        />

                        <Input 
                            type="text" 
                            name="state" 
                            label='State/Province' 
                            placeholder='Enter your state or province'
                            value={user?.state || ''}
                            onChange={(e) => setUser({ ...user, state: e.target.value })} 
                        />

                        <Input 
                            type="text" 
                            name="country" 
                            label='Country' 
                            placeholder='Enter your country'
                            value={user?.country || ''}
                            onChange={(e) => setUser({ ...user, country: e.target.value })} 
                        />

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
                                onChange={(date) => {
                                    setBirthDate(date);
                                    setDateError(''); // Clear error when date changes
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select date of birth"
                                className={`${styles.datePickerInput} date-picker-custom ${dateError ? styles.error : ''}`}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                maxDate={new Date()} // Prevent future dates
                                locale="en-GB"
                            />
                            {dateError && <span className={styles.errorMessage}>{dateError}</span>}
                        </div>

                    </div>

                    <Button
                        text={isLoading ? "Saving..." : "Save"}
                        icon={RightIcon}
                        onClick={handleEditProfile}
                        disabled={!hasChanges() || isLoading}
                    />
                </div>
            </div>
        </div>
    )
}
