"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./sidebar.module.scss";
import Logo from "../logo";
import DashboardIcon from "@/icons/dashboardIcon";
import CourseIcon from "@/icons/courseIcon";
import DownArrow from "@/icons/downArrow";
import classNames from "classnames";
import ContactUs from "@/icons/contactUs";
import SettingsIcon from "@/icons/settingsIcon";
import NotificationIcon from "@/icons/notificationIcon";
import ProfileI from "@/icons/profileI";
import CommonButton from "../commonButton";
import CloseIcon from "@/icons/closeIcon";
import SignoutIcon from "@/icons/signoutIcon";
import { getCookie, removeCookie } from "../../../cookie";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Algobot from "@/icons/algobot";
import toast from "react-hot-toast";
import UserIcon from "@/icons/userIcon";
import PaymentIcon from "@/icons/paymentIcon";
import TelegramIcon from "@/icons/telegramIcon";
import InstructorIcon from "@/icons/instructorIcon";
import { getProfile } from "../api/auth";
const SidebarLayer = "/assets/images/sidebar-layer.png";
const LogoutIcon = "/assets/icons/logout.svg";
const DownIcon = "/assets/icons/down-white.svg";

export default function Sidebar({ setToogle, toogle, unreadCount }) {
  const [user, setUser] = useState();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();


  const handleTabClick = (tab) => {
    setProfileDropdown(false);
    const goTo = "/" + tab;
    router.replace(goTo);
    setToogle(false);
  };

  const handleLogout = () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    removeCookie("userToken");
    removeCookie("user");
    toast.success("Logout successfully.");
    router.push("/");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userData = getCookie("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          const userProfile = await getProfile(parsedUser._id);
          console.log("User profile data:", userProfile); // Debug log
          setUser(
            userProfile.payload.data[0]

          );
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to basic user data if API call fails
          const parsedUser = JSON.parse(userData);

        }
      }
    };

    fetchUserProfile();
  }, []);
  console.log(user)

  return (
    <div className={styles.stickyBar}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLayer}>
          <img src={SidebarLayer} alt="SidebarLayer" />
        </div>
        <div className={styles.logo}>
          <Link href="/">
            <Logo />
          </Link>
          <div className={styles.close} onClick={() => setToogle(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.sidebarBody}>
          {/* <div
            className={`${styles.menu} ${
              pathname === "/dashboard" ? styles.active : ""
            }`}
            onClick={() => {
              handleTabClick("dashboard");
            }}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </div> */}

          <div
            className={`${styles.menu} ${pathname === "/my-courses" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("my-courses");
            }}
          >
            <CourseIcon />
            <span>My Library</span>
          </div>
          <div
            className={`${styles.menu} ${pathname === "/course" ? styles.active : ""
              }`}
            onClick={() => handleTabClick("course")}
          >
            <CourseIcon />
            <span>Courses</span>
          </div>
          <div
            className={`${styles.menu} ${pathname === "/algobot" ? styles.active : ""
              }`}
            onClick={() => handleTabClick("algobot")}
          >
            <Algobot />
            <span>AlgoBots</span>
          </div>

          <div
            className={`${styles.menu} ${pathname === "/telegram" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("telegram");
            }}
          >
            <TelegramIcon />
            Telegram Channels
          </div>

          <div
            className={`${styles.menu} ${pathname === "/instructor" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("instructor");
            }}
          >
            <InstructorIcon />
            <span>Instructor</span>
          </div>

          <div
            className={`${styles.menu} ${pathname === "/notification" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("notification");
            }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <NotificationIcon />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span>Notifications</span>
          </div>

          <div
            className={`${styles.menu} ${pathname === "/paymentHistory" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("paymentHistory");
            }}
          >
            <PaymentIcon />
            <span>Payment History</span>
          </div>
          <div
            className={`${styles.menu} ${pathname === "/contact-us" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("contact-us");
            }}
          >
            <ContactUs />
            <span>Contact Us</span>
          </div>
           <div
            className={`${styles.menu} ${pathname === "/refer-and-earn" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("refer-and-earn");
            }}
          >
            <PaymentIcon />
            <span>Refer & Earn</span>
          </div>
        </div>
        <div className={styles.sidebarFooter}>
          <div className={styles.relativeDiv}>
            <div
              onClick={() => setProfileDropdown(!profileDropdown)}
              className={classNames(
                styles.buttonDeisgn,
                profileDropdown ? styles.iconRotate : ""
              )}
            >
              <button>
                <div className={styles.profileContainer}>
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.userIconWrapper}>
                      <UserIcon />
                    </div>
                  )}
                  <span className={styles.userName}>{user?.name}</span>
                </div>
                <img src={DownIcon} className={styles.dropdownIcon} alt="DownIcon" />
              </button>
            </div>
            <div
              className={classNames(
                styles.dropdown,
                profileDropdown ? styles.show : styles.hide
              )}
            >
              <div className={styles.dropdownSpacing}>
                <div
                  className={styles.iconText}
                  onClick={() => handleTabClick("profile")}
                >
                  <ProfileI />
                  <span>Profile</span>
                </div>
                {/* <div className={styles.iconText} onClick={()=>handleTabClick("settings")}>
                    <SettingsIcon />
                    <span>Settings</span>
                  </div> */}
                <div className={styles.iconText} onClick={handleLogout}>
                  <SignoutIcon
                    text="Logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    icon={LogoutIcon}
                    className={styles.logoutButton}
                  />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
