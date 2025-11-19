'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './authentication.module.scss';
import { errorMessages } from '@/utils/constant';
import { setCookie } from '../../../cookie';
import { loginWithGoogle } from '../api/auth';
import toast from 'react-hot-toast';
import Modal from '../modal/Modal';
import LocationForm from '../modal/LocationForm'; 

const GoogleIcon = '/assets/icons/google-icon.svg';
const FacebookIcon = '/assets/icons/facebook.svg';
const LinkdinIcon = '/assets/icons/linkdin-icon.svg';

export default function Authentication() {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const googleLogin = async () => {
    try {
      const data = await loginWithGoogle();
      if (data.success) {
        toast.success("Login successful.");
        setCookie("userToken", data.payload.token);
        setCookie("user", data.payload);
        
        // Check if user has location details
        if (!data.payload.location) {
          setUserData(data.payload);
          setShowLocationModal(true);
        } else {
          router.push("/profile");
        }
      } else {
        toast.error(errorMessages[data?.message] ?? errorMessages["default"]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Login Failed.");
    }
  };

  return (
    <div className={styles.authentication}>
      <div className={styles.whiteButton} onClick={googleLogin}>
        <img src={GoogleIcon} alt='GoogleIcon'/> 
        <span>Continue with Google</span>
      </div>
      
      {/* Location Modal */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Complete Your Profile"
      >
        <LocationForm 
          initialData={userData}
          setShowLocationModal={setShowLocationModal}
        />
      </Modal>
    </div>
  );
}