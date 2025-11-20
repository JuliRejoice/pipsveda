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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          placeholder="Enter your address"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Country</label>
        <CountrySelect
          containerClassName={styles.selectContainer}
          inputClassName={styles.selectInput}
          dropdownClassName={styles.dropdown}
          value={formData.country}
          onChange={handleCountryChange}
          placeHolder="Select Country"
        />
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
          placeHolder="Select State"
        />
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
          placeHolder="Select City"
        />
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