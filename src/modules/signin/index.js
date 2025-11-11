"use client";
import React, { useState, useEffect } from "react";
import styles from "./signin.module.scss";
import Input from "@/compoents/input";
import Button from "@/compoents/button";
import Authentication from "@/compoents/authentication";
import Link from "next/link";
import { signIn } from "@/compoents/api/auth";
import { useRouter } from "next/navigation";
import Logo from "@/compoents/logo";
import { setCookie } from "../../../cookie";
import { errorMessages } from "@/utils/constant";
import toast from "react-hot-toast";

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
    const trimmedValue = value.trim().toLowerCase();
    if (!trimmedValue) return "Email is required.";
    if (trimmedValue.includes(" ")) return "Email cannot contain spaces.";
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!re.test(trimmedValue)) return "Enter a valid email address.";
    return "";
  };

  const validatePassword = (value) => {
    if (!value || !value.trim()) return "Password is required.";
    if (value.includes(" ")) return "Password cannot contain spaces.";
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
        submit: "",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signIn(email, password);

      if (data.success) {
        toast.success("Login successfully.");
        setCookie("userToken", data.payload.token);
        setCookie("user", data.payload);
        router.push("/dashboard");
      } else {
        // handle case where API responds with success=false
        toast.dismiss();
        toast.error(
          errorMessages[data?.message] ?? "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      // axios puts the server error here
      const serverMessage = error.response?.data?.message;

      if (serverMessage && errorMessages[serverMessage]) {
        toast.dismiss();
        toast.error(errorMessages[serverMessage]);
      } else {
        toast.dismiss();
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.signinBanner}>
      <div className="container">
        <div className={styles.signinBox}>
          <div className={styles.logoCenter}>
            <Logo />
          </div>
          <div className={styles.text}>
            <h2>Welcome Back</h2>
            <p>Continue your journey into the world of financial Five Veday.</p>
          </div>
          <div className={styles.leftRightAlignment}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isSubmitting) handleLogin();
              }}
            >
              <div className={styles.inputAlignment}>
                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value.toLowerCase());
                    // Only validate on change if there's an existing error
                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: validateEmail(value, false),
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    setErrors((prev) => ({
                      ...prev,
                      email: validateEmail(e.target.value, true),
                    }));
                  }}
                />
                {errors.email && (
                  <span className={styles.errormsg}>{errors.email}</span>
                )}
              </div>

              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={showPassword ? EyeSlashIcon : EyeIcon}
                onIconClick={() => setShowPassword(!showPassword)}
                placeholder="Enter your password"
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <span className={styles.errormsg}>{errors.password}</span>
              )}

              <div className={styles.forgotPassword}>
                <Link href="/reset-password" aria-label="reset-password">
                  Forgot password?
                </Link>
              </div>
              {errors.submit && (
                <span className={styles.errormsg}>{errors.submit}</span>
              )}

              <div className={styles.buttonWidthFull}>
                <Button
                  type="submit" // important for Enter key
                  text={isSubmitting ? "Logging in..." : "Sign In"}
                  icon={RightIcon}
                  disabled={isSubmitting}
                />
              </div>
            </form>

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
