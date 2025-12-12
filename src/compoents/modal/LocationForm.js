'use client';
import React, { useState, useEffect } from 'react';
import Button from '../button';
import styles from './locationForm.module.scss';
import { editProfile } from '../api/auth';

import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import { getCookie } from '../../../cookie';
import { useRouter } from 'next/navigation';

const LocationForm = ({ setShowLocationModal , initialData }) => {
  const [formData, setFormData] = useState({
    location: '',
    city: '',
    state: '',
    country: '',
    ...initialData?.location
  });
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTouched, setIsTouched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialData?._id) {
      // If we have initial data, set the form data
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (country) => {
    setCountryId(country?.id || 0);
    setFormData(prev => ({
      ...prev,
      country: country?.name || '',
      state: '',
      city: ''
    }));
    setStateId(0);
  };

  const handleStateChange = (state) => {
    setStateId(state?.id || 0);
    setFormData(prev => ({
      ...prev,
      state: state?.name || '',
      city: ''
    }));
  };

  const handleCityChange = (city) => {
    setFormData(prev => ({
      ...prev,
      city: city?.name || ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Address is required';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    if (!isTouched) return;
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTouched(true);
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsLoading(true);
    
    try {
      const userData = JSON.parse(getCookie("user"));
      const sendData = new FormData();      
      
      // Append location data
      sendData.append("location", formData.location || '');
      sendData.append("city", formData.city || '');
      sendData.append("state", formData.state || '');
      sendData.append("country", formData.country || '');
      
      const res = await editProfile(userData._id, sendData);
      
      if (res.success) {
        setShowLocationModal(false);
        router.push('/course');
      } else {
        throw new Error(res.message || "Failed to update location");
      }
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.locationForm}>
      <div className={styles.formGroup}>
        <label htmlFor="location">Address</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          onBlur={() => handleBlur('location')}
          placeholder="Enter your address"
          className={errors.location ? styles.errorInput : ''}
        />
        {errors.location && <span className={styles.errorText}>{errors.location}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Country</label>
        <CountrySelect
          containerClassName={styles.selectContainer}
          inputClassName={styles.selectInput}
          dropdownClassName={styles.dropdown}
          value={formData.country}
          onChange={handleCountryChange}
          onBlur={() => handleBlur('country')}
          placeHolder="Select Country"
          className={errors.country ? styles.errorInput : ''}
        />
        {errors.country && <span className={styles.errorText}>{errors.country}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>State</label>
        <StateSelect
          countryid={countryId}
          containerClassName={styles.selectContainer}
          inputClassName={styles.selectInput}
          dropdownClassName={styles.dropdown}
          value={formData.state}
          onChange={handleStateChange}
          onBlur={() => handleBlur('state')}
          placeHolder="Select State"
          className={errors.state ? styles.errorInput : ''}
        />
        {errors.state && <span className={styles.errorText}>{errors.state}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>City</label>
        <CitySelect
          countryid={countryId}
          stateid={stateId}
          containerClassName={styles.selectContainer}
          inputClassName={styles.selectInput}
          dropdownClassName={styles.dropdown}
          value={formData.city}
          onChange={handleCityChange}
          onBlur={() => handleBlur('city')}
          placeHolder="Select City"
          className={errors.city ? styles.errorInput : ''}
        />
        {errors.city && <span className={styles.errorText}>{errors.city}</span>}
      </div>

      <div className={styles.buttonContainer}>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isLoading}
          text={isLoading ? 'Saving...' : 'Save Location'}
        />
      </div>
    </form>
  );
};

export default LocationForm;