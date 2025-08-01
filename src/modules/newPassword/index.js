'use client'
import React, { useEffect, useState } from 'react'
import styles from './newPassword.module.scss';
import Button from '@/compoents/button';
import Input from '@/compoents/input';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/compoents/api/auth';

const RightIcon = '/assets/icons/right-lg.svg';
const EyeIcon = '/assets/icons/eye.svg';

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ newPassword: "", confirmPassword: "", submit: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailFromState = localStorage.getItem('email');
    if (emailFromState) {
      setEmail(emailFromState);
    }
  }, []);

  const handleSetNewPassword = async () => {
    // Clear previous errors
    setErrors({ newPassword: "", confirmPassword: "", submit: "" });
    
    const validationErrors = {
      newPassword: "",
      confirmPassword: "",
      submit: ""
    };
  
    // Validate new password
    if (!newPassword || newPassword.trim() === "") {
      validationErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      validationErrors.newPassword = "Password must be at least 6 characters";
    }
  
    // Validate confirm password
    if (!confirmPassword || confirmPassword.trim() === "") {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
  
    // Check if there are any validation errors
    const hasError = Object.values(validationErrors).some(err => err !== "");
    if (hasError) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      const res = await updatePassword({ 
        email,
        password: newPassword 
      });
  
      if (res.success) {
        // Clear sensitive data from localStorage
        localStorage.removeItem('email');
        // Redirect to signin on success
        router.push("/signin");
      } else {
        // Handle API error response
        setErrors({
          ...validationErrors,
          submit: res.message || "Failed to update password. Please try again."
        });
      }
    } catch (err) {
      console.error('Password update error:', err);
      setErrors({
        ...validationErrors,
        submit: err.message || "An error occurred. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.newPassword}>
      <div className="container">
        <div className={styles.signinBox}>
          <div className={styles.text}>
            <h2>Set new password</h2>
          </div>
          <div className={styles.leftRightAlignment}>
            <div className={styles.inputAlignment}>
              <Input
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="**************"
                icon={EyeIcon}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && <span className={styles.error}>{errors.newPassword}</span>}
            </div>

            <div className={styles.inputAlignment}>
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="**************"
                icon={EyeIcon}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
            </div>

            {errors.submit && <span className={styles.error}>{errors.submit}</span>}

            <div className={styles.buttonWidthFull} onClick={handleSetNewPassword}>
              <Button
                text={isSubmitting ? "Updating..." : "Set new password"}
                icon={isSubmitting ? null : RightIcon}
                disabled={isSubmitting}
                showLoader={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
