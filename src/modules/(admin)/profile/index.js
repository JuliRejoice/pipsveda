"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./profile.module.scss";
import Breadcumbs from "../breadcumbs";
import Input from "@/compoents/input";
import Button from "@/compoents/button";
import { getCookie, setCookie } from "../../../../cookie";
import { editProfile, getProfile, uploadImage } from "@/compoents/api/auth";
import UserIcon from "@/icons/userIcon";
import toast from "react-hot-toast";
import Dropdownarrow from "@/icons/dropdownarrow";
import { regions } from "@/regions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import AdminHeader from "@/compoents/adminHeader";

// Register the English (GB) locale
registerLocale("en-GB", enGB);

const RightIcon = "/assets/icons/right.svg";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  // dropdown states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+12");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [initialUserData, setInitialUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  // Default to India's country ID (101) and a default state ID if needed
  const [countryId, setCountryId] = useState(101);
  const [stateId, setStateId] = useState(0);
  const [isCountrySet, setIsCountrySet] = useState(false);

  const countryRef = useRef(null);
  const genderRef = useRef(null);
  
  // Form state
  const [form, setForm] = useState({
    phone: '',
    countryCode: '+91', // Default country code
  });
  
  // Handle form input changes
  const handleChange = (name, value) => {
    // Update the form state
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Also update the user state for phone number
    if (name === 'phone') {
      setUser(prev => ({
        ...prev,
        phone: value
      }));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = getCookie("user");
      const parsedUser = JSON.parse(userData)._id;
      const response = await getProfile(parsedUser);
      const user = response.payload.data[0];

      // Set default country to India if not set
      if (!user.country) {
        user.country = "India";
      }

      setUser(user);
      setInitialUserData(user);

      if (user.profileImage) {
        setPreviewImage(user.profileImage);
      }

      // Set birthdate if available
      if (user?.birthday) {
        setBirthDate(new Date(user.birthday));
      }

      // Initialize form state with user data
      setForm(prev => ({
        ...prev,
        phone: user.phone || '',
        countryCode: user.countryCode || '+91'
      }));

      // Set country code if available
      if (user?.countryCode) {
        setSelectedCountryCode(user.countryCode);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
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
    if (!user.name || !user.phone || !user.gender || !birthDate) {
      return false;
    }
    return true;
  };

  const handleEditProfile = async () => {
    setPhoneError("");
    setDateError("");

    // Phone number validation
    if (!user?.phone || user.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits");
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
      setDateError("You must be at least 13 years old");
      return;
    }

    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append all user data to formData
      formData.append("name", user.name?.trim() || "");
      formData.append("phone", user.phone?.trim() || "");
      formData.append("location", user.location || "");
      formData.append("city", user.city || "");
      formData.append("state", user.state || "");
      formData.append("country", user.country || "");
      formData.append("gender", selectedGender || user.gender || "");
      formData.append("countryCode", selectedCountryCode);
      formData.append(
        "birthday",
        birthDate ? birthDate.toISOString().split("T")[0] : ""
      );

      // Append profile image if selected
      if (profileImage) {
        const imageRes = await uploadImage(profileImage);
        formData.append("profileImage", imageRes.payload);
      }

      const res = await editProfile(user._id, formData);

      if (res.success) {
        setCookie("user", JSON.stringify(res.payload));
        toast.success("Profile updated successfully");
        fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    if (!initialUserData || !user) return false;

    // Format dates for comparison
    const formattedBirthDate = birthDate ? new Date(birthDate).toISOString().split("T")[0] : null;
    const initialBirthDate = initialUserData.birthday ? new Date(initialUserData.birthday).toISOString().split("T")[0] : null;

    // Get current gender from user state if selectedGender is not set
    const currentGender = selectedGender || user.gender || '';
    const initialGender = initialUserData.gender || '';

    // Check if any profile field has changed
    const profileFieldsChanged =
      (user.name || '') !== (initialUserData.name || '') ||
      (user.phone || '') !== (initialUserData.phone || '') ||
      currentGender !== initialGender ||
      (user.location || '') !== (initialUserData.location || '') ||
      (user.city || '') !== (initialUserData.city || '') ||
      (user.state || '') !== (initialUserData.state || '') ||
      (user.country || '') !== (initialUserData.country || '') ||
      (selectedCountryCode || '+91') !== (initialUserData.countryCode || '+91') ||
      (formattedBirthDate !== initialBirthDate && (formattedBirthDate || initialBirthDate));

    // Check if profile image has changed
    const imageChanged = 
      profileImage !== null || // New image selected
      (previewImage && previewImage !== (initialUserData.profileImage || '')); // Preview URL changed

    return profileFieldsChanged || imageChanged;
  };
  return (
    <div className={styles.profilePageAlignment}>
      <AdminHeader/>
      <div className={styles.profileBox}>
        {/* Profile Image Upload */}

        <div className={styles.cardHeader}>
          <h2>Edit Profile</h2>
          <p>
            Update your personal information, contact details, and preferences
            to keep your profile up to date.
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
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
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
                style={{ display: "none" }}
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
              label="First Name"
              placeholder="Enter your first name"
              value={user?.name || ""}
              onChange={(e) => {
                // Remove leading spaces
                const value = e.target.value.replace(/^\s+/, "");
                setUser({ ...user, name: value });
              }}
            />
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={user?.email || ""}
              disabled={true}
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
                          <div className={styles.searchContainer}>
                            <input
                              type="text"
                              placeholder="Search country code..."
                              className={styles.searchInput}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className={styles.dropdownSpacing}>
                            {regions
                              .filter(region =>
                                region.numberCode.includes(searchTerm) ||
                                region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                region.code.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                              .map((region) => (
                                <div
                                  className={styles.iconText}
                                  key={region.code}
                                  onClick={() => {
                                    const newCountryCode = region.numberCode;
                                    setSelectedCountryCode(newCountryCode);
                                    // Update the form state with the new country code
                                    setForm(prev => ({
                                      ...prev,
                                      countryCode: newCountryCode
                                    }));
                                    setShowCountryDropdown(false);
                                    setSearchTerm('');
                                  }}
                                >
                                  <span className={styles.countryCode}>{region.numberCode}</span>
                                  <span className={styles.countryName}>({region.code}) {region.name}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder='Enter your number'
                      value={user?.phone || ''}
                      onChange={(e) => {
                        // Only allow numbers and limit to 15 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 15);
                        setUser({ ...user, phone: value });
                        if (phoneError) setPhoneError('');
                      }}
                      onBlur={(e) => {
                        if (e.target.value && e.target.value.length < 10) {
                          setPhoneError('Phone number must be at least 10 digits');
                        } else {
                          setPhoneError('');
                        }
                      }}
                      className={`${styles.phoneInput} ${phoneError ? styles.error : ''}`}
                    />
                    {phoneError && <span className={styles.errorMessage}>{phoneError}</span>}
                  </div>
                </div>
              </div>
            </div>

            <Input
              type="text"
              name="location"
              label="Location"
              placeholder="Enter your location"
              value={user?.location || ""}
              onChange={(e) => setUser({ ...user, location: e.target.value })}
            />

            <div className={styles.dropdownrelative}>
              <label className={styles.labelStyle}>Country</label>
              <div className={styles.selectWrapper}>
                <CountrySelect
                  defaultValue={user?.country}
                  onChange={(val) => {
                    setUser((prev) => ({
                      ...prev,
                      country: val.name,
                      state: "",
                      city: "",
                    }));
                    setCountryId(val.id);
                    setStateId(0);
                  }}
                  placeHolder="Select Country"
                  className={styles.selectInput}
                />
                {/* <Dropdownarrow className={styles.dropdownIcon} /> */}
              </div>
            </div>

            <div className={styles.dropdownrelative}>
              <label className={styles.labelStyle}>State</label>
              <div className={styles.selectWrapper}>
                <StateSelect
                  defaultValue={user?.state || ""}
                  countryid={countryId || 101}
                  onChange={(val) => {
                    setUser((prev) => ({
                      ...prev,
                      state: val.name,
                      city: "",
                    }));
                    setStateId(val.id);
                  }}
                  placeHolder={
                    countryId ? "Select State" : "Select Country First"
                  }
                  className={styles.selectInput}
                  disabled={!countryId}
                />
                {/* <Dropdownarrow className={styles.dropdownIcon} /> */}
              </div>
            </div>

            <div className={styles.dropdownrelative}>
              <label className={styles.labelStyle}>City</label>
              <div className={styles.selectWrapper}>
                <CitySelect
                  defaultValue={user?.city ? { name: user.city } : null}
                  countryid={countryId || 101} // Default to India's ID if not set
                  stateid={stateId}
                  onChange={(val) => {
                    setUser((prev) => ({
                      ...prev,
                      city: val.name,
                    }));
                  }}
                  placeHolder={stateId ? "Select City" : "Select State First"}
                  className={styles.selectInput}
                  disabled={!stateId}
                
                />
                {/* <Dropdownarrow className={styles.dropdownIcon} /> */}
              </div>
            </div>

            {/* Gender dropdown */}
            <div className={styles.dropdownrelative} ref={genderRef}>
              <div className={styles.dropdownhead}>
                <label>Gender</label>
                <div
                  className={styles.dropdowninput}
                  onClick={() => setShowGenderDropdown((prev) => !prev)}
                >
                  <div className={styles.dropdownselecteditem}>
                    <span>{user?.gender || "Select Gender"}</span>
                  </div>
                  <div className={styles.dropdownarrow}>
                    <Dropdownarrow />
                  </div>
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
                  setDateError(""); // Clear error when date changes
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date of birth"
                className={`${styles.datePickerInput} date-picker-custom ${dateError ? styles.error : ""
                  }`}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                locale="en-GB"
              />
              {dateError && (
                <span className={styles.errorMessage}>{dateError}</span>
              )}
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
  );
}
