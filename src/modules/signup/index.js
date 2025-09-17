"use client";
import React, { useState } from "react";
import styles from "./signup.module.scss";
import Input from "@/compoents/input";
import Logo from "@/compoents/logo";
import Button from "@/compoents/button";
import Authentication from "@/compoents/authentication";
import Link from "next/link";
import { signUp } from "@/compoents/api/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { errorMessages } from "@/utils/constant";
const RightIcon = "/assets/icons/right-lg.svg";
const EyeIcon = "/assets/icons/eye.svg";
const EyeSlashIcon = "/assets/icons/eye-slash.svg";
export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Name: Only letters, spaces, apostrophes, hyphens; min 2 chars
const validateName = (value) => {
    if (!value) return "Name is required.";
    const nameRegex = /^[A-Za-z\s'-]{2,}$/;
    if (!nameRegex.test(value)) {
        return "Name must be at least 2 characters and contain only letters.";
    }
    return "";
};

// Email: RFC-like but practical for web use
const validateEmail = (value) => {
  const trimmedValue = value.trim().toLowerCase(); // 👈 force lowercase
  if (!trimmedValue) return "Email is required.";
  if (trimmedValue.includes(' ')) return "Email cannot contain spaces.";   
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!re.test(trimmedValue)) return "Enter a valid email address.";   
  return "";
};

// Password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
const validatePassword = (value) => {
    if (!value) return "Password is required.";
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(value)) {
        return "Password must be at least 6 characters, include uppercase, lowercase, number, and special character.Example: Hello@123";
    }
    return "";
};

// Confirm Password: Match with password
const validateConfirmPassword = (value, password) => {
    if (!value) return "Confirm Password is required.";
    if (value !== password) return "Passwords do not match.";
    return "";
};


  const handleSignup = () => {
    const nameError = validateName(data.name);
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);

    const confirmPasswordError = validateConfirmPassword(
      data.confirmPassword,
      data.password
    );
    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      submit: "",
    };
    setErrors(newErrors);
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }
    setIsSubmitting(true);
    signUp({ name: data.name, email: data.email, password: data.password })
  .then((response) => {
    if (response.success) {
      setIsSubmitting(false);
      toast.success("User Signup successfully.");
      setErrors({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        submit: "",
      });
      router.push("/signin");
    } else {
      setIsSubmitting(false);
      toast.error(
        errorMessages[response?.message] ??
          "User Signup failed. Please try again."
      );
    }
  })
  .catch((error) => {
    setIsSubmitting(false);

    const serverMessage = error.response?.data?.message;

    setErrors((prev) => ({
      ...prev,
      submit:
        (serverMessage && errorMessages[serverMessage]) ||
        "User Signup failed. Please try again.",
    }));
  });

  };
  return (
    <div className={styles.signup}>
      <div className="container">
        <div className={styles.signinBox}>
          <div className={styles.logoCenter}>
            <Logo />
          </div>
          <div className={styles.text}>
            <h2>Create Your Free Account</h2>
            <p>
              Start learning from industry experts and grow your financial
              skills.
            </p>
          </div>
          <div className={styles.leftRightAlignment}>
            <form
              onSubmit={(e) => {
                e.preventDefault(); 
                if (!isSubmitting) handleSignup();
              }}
            >
            <div className={styles.inputAlignment}>
              <Input
                name="name"
                type="text"
                label="Name"
                placeholder="Enter your name"
                value={data.name}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value.trim() });
                  setErrors((prev) => ({
                    ...prev,
                    name: validateName(e.target.value),
                  }));
                }}
              />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
            </div>
            <div className={styles.inputAlignment}>
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={data.email}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value.toLowerCase() });
                  if (errors.email) {
                    setErrors(prev => ({ 
                        ...prev, 
                        email: validateEmail(e.target.value.toLowerCase(), false) 
                    }));
                }
                }}
                onBlur={(e) => {
                    setErrors(prev => ({ 
                        ...prev, 
                        email: validateEmail(e.target.value.toLowerCase(), true) 
                    }));
                }}
              />
              {errors.email && (
                <div className={styles.error}>{errors.email}</div>
              )}
            </div>
            <div className={styles.inputAlignment}>
              <Input
                name="password"
                type={`${showPassword ? "text" : "password"}`}
                label="Password"
                onIconClick={() => setShowPassword(!showPassword)}
                icon={!showPassword ? EyeIcon : EyeSlashIcon}
                placeholder="Enter your password"
                value={data.password}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                  setErrors((prev) => ({
                    ...prev,
                    password:"",
                    confirmPassword: "",
                  }));
                }}
              />
              {errors.password && (
                <div className={styles.error}>{errors.password}</div>
              )}
            </div>
            <Input
              name="confirmPassword"
              type={`${showConfirmPassword ? "text" : "password"}`}
              label="Confirm Password"
              onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              icon={!showConfirmPassword ? EyeIcon : EyeSlashIcon}
              placeholder="Enter your confirm password"
              value={data.confirmPassword}
              onKeyDown={(e) => {
                if (e.key === ' ') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setData({ ...data, confirmPassword: e.target.value });
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",  
                }));
              }}
            />
            {errors.confirmPassword && (
              <div className={styles.error}>{errors.confirmPassword}</div>
            )}
            <div className={styles.forgotPassword}>
              <Link href="/reset-password" aria-label="reset-password">
                Forgot password?
              </Link>
            </div>
            {errors.submit && (
              <div className={styles.error}>{errors.submit}</div>
            )}
            <div className={styles.buttonWidthFull}>
              <Button
                text={isSubmitting ? "Signing up..." : "Sign Up"}
                icon={RightIcon}
                disabled={
                  isSubmitting ||
                  !!errors.name ||
                  !!errors.email ||
                  !!errors.password ||
                  !!errors.confirmPassword
                }
                onClick={!isSubmitting && handleSignup}
              />
            </div>
            </form>
            <Authentication />
            <div className={styles.dontHaveAccount}>
              <p>
                Already have an account?{" "}
                <Link aria-label="sign in" href="/signin">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
