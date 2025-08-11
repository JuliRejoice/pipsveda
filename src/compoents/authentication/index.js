import React from 'react'
import styles from './authentication.module.scss';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

import { errorMessages } from '@/utils/constant';
import { setCookie } from '../../../cookie';
import { loginWithGoogle } from '../api/auth';
const GoogleIcon = '/assets/icons/google-icon.svg';
const FacebookIcon = '/assets/icons/facebook.svg';
const LinkdinIcon = '/assets/icons/linkdin-icon.svg';
export default function Authentication() {
  const router = useRouter();
  const googleLogin = async () => {
    try {
      const data = await loginWithGoogle();
      if (data.success) {
        toast.success("Login successfully.");
        setCookie("userToken", data.payload.token);
        setCookie("user", data.payload);
        router.push("/courses/pre-recorded");
      } else {
        toast.error(
          errorMessages[data?.message] ?? errorMessages["default"]
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(errorMessages[error.code] ?? errorMessages["default"]);
    }
  };
  
  return (
    <div className={styles.authentication}>
      <div className={styles.whiteButton} onClick={googleLogin}>
        <img src={GoogleIcon} alt='GoogleIcon'/> <span>Continue with Google</span>
      </div>
      {/* <div className={styles.whiteButton}>
        <img src={FacebookIcon} alt='FacebookIcon'/>
      </div>
      <div className={styles.whiteButton}>
        <img src={LinkdinIcon} alt='LinkdinIcon'/>
      </div> */}
    </div>
  )
}
