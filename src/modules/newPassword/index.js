"use client";
import React, { useEffect, useState } from "react";
import styles from "./newPassword.module.scss";
import Button from "@/compoents/button";
import Input from "@/compoents/input";
import { useRouter, useSearchParams } from "next/navigation";
import { updatePassword } from "@/compoents/api/auth";
import toast from "react-hot-toast";


const RightIcon = "/assets/icons/right-lg.svg";
const EyeIcon = "/assets/icons/eye.svg";
const EyeSlashIcon = "/assets/icons/eye-slash.svg";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {

    if (typeof window === 'undefined') return;

    const emailFromState = localStorage.getItem("email");
    const emailFromParams = searchParams.get('email');
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromParams) {
      localStorage.setItem("email", emailFromParams);
      setEmail(emailFromParams);
    } else {
      router.replace("/signin");
    }
  }, [router, searchParams]);

  const handleSetNewPassword = async () => {
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
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(newPassword)) {
        validationErrors.newPassword = "Password must include uppercase, lowercase, number, and special character (@$!%*?&)";
      }
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
      console.error("Password update error:", err);
      setErrors({
        ...validationErrors,
        submit: err.message || "An error occurred. Please try again later.",
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
            <form
              onSubmit={(e) => {
                e.preventDefault(); 
                if (!isSubmitting) handleSetNewPassword();
              }}
            >
            <div className={styles.inputAlignment}>
              <Input
                name="newPassword"
                type={showPassword ? "text" : "password"}
                label="New Password"
                placeholder="**************"
                onIconClick={() => setShowPassword(!showPassword)}
                icon={!showPassword ? EyeIcon : EyeSlashIcon}
                value={newPassword}
                onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                onChange={(e) =>{ setNewPassword(e.target.value);
                  setErrors({
                    newPassword: ""
                  });
                }}
              />
              {errors.newPassword && (
                <span className={styles.error}>{errors.newPassword}</span>
              )}
            </div>

            <div className={styles.inputAlignment}>
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="**************"
                onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                icon={!showConfirmPassword ? EyeIcon : EyeSlashIcon}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value);
                  setErrors({
                    confirmPassword: ""
                  });
                }}
              />
              {errors.confirmPassword && (
                <span className={styles.error}>{errors.confirmPassword}</span>
              )}
            </div>

            {errors.submit && (
              <span className={styles.error}>{errors.submit}</span>
            )}

            <div className={styles.buttonWidthFull}>
              <Button
                text={isSubmitting ? "Updating..." : "Set new password"}
                icon={isSubmitting ? null : RightIcon}
                disabled={isSubmitting}
                showLoader={isSubmitting}
                onClick={handleSetNewPassword}
              />
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
