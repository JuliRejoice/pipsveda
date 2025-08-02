"use client";
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./signin.module.scss";
import Input from "@/compoents/input";
import Button from "@/compoents/button";
import Authentication from "@/compoents/authentication";
import Link from "next/link";
import { signIn } from "@/compoents/api/auth";
import { useRouter } from "next/navigation";
import Logo from "@/compoents/logo";
import { getCookie, setCookie } from "../../../cookie";

const RightIcon = "/assets/icons/right-lg.svg";
const EyeIcon = "/assets/icons/eye.svg";
const EyeSlashIcon = "/assets/icons/eye-slash.svg";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", submit: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();


  const validateEmail = (value) => {
    if (!value) return "Email is required.";
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(value)) return "Enter a valid email address.";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        submit: ""
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signIn(email, password);
      console.log(data);
      if (data.success) {
        toast.success('Login successfully.');
        setCookie("userToken", data.payload.token);
        setCookie("user", data.payload);
        router.push("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.signinBanner}>
      <div className="container">
        <div className={styles.signinBox}>
          <div className={styles.logoCenter}>
            <Logo/>
          </div>
          <div className={styles.text}>
            <h2>Welcome Back</h2>
            <p>Continue your journey into the world of financial mastery.</p>
          </div>
          <div className={styles.leftRightAlignment}>
            <div className={styles.inputAlignment}>
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                }}
              />
              {errors.email && <span className={styles.errormsg}>{errors.email}</span>}
            </div>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              icon={showPassword ? EyeSlashIcon : EyeIcon}
              onIconClick={() => setShowPassword(!showPassword)}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }));
              }}
            />
            {errors.password && <span className={styles.errormsg}>{errors.password}</span>}
            <div className={styles.forgotPassword}>
              <Link href="/reset-password" aria-label="reset-password">
                Forgot password?
              </Link>
            </div>
            {errors.submit && <span className={styles.errormsg}>{errors.submit}</span>}
            <div
              className={styles.buttonWidthFull}
            >
              <Button text={isSubmitting ? "Logging in..." : "Sign In"} icon={RightIcon} disabled={isSubmitting || !!errors.email || !!errors.password} onClick={!isSubmitting && handleLogin} />
            </div>
            <Authentication />
            <div className={styles.dontHaveAccount}>
              <p>
                Don’t have an account?{" "}
                <Link aria-label="signup" href="/signup">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
