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
import PaymentIcon from "@/icons/paymentIcon";
import TelegramIcon from "@/icons/telegramIcon";
const SidebarLayer = "/assets/images/sidebar-layer.png";
const LogoutIcon = "/assets/icons/logout.svg";
const DownIcon = "/assets/icons/down-white.svg";

export default function Sidebar({ setToogle, toogle }) {
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isCoursePage = pathname.startsWith('/courses/') || pathname === '/course';
    setDropdown(isCoursePage);
  }, [pathname]);

  const handleTabClick = (tab) => {
    setProfileDropdown(false);
    const goTo = "/" + tab;
    router.replace(goTo);
    setActiveSubTab("");
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
    const user = getCookie("user");
    const userName = user && JSON.parse(user)?.name;
    setUser(userName);
  }, []);



  return (
    <div className={styles.stickyBar}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLayer}>
          <img src={SidebarLayer} alt="SidebarLayer" />
        </div>
        <div className={styles.logo}>
          <Link href="/"><Logo /></Link>
          <div className={styles.close} onClick={() => setToogle(false)}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.sidebarBody}>
          <div
            className={`${styles.menu} ${pathname === "/dashboard" ? styles.active : ""
              }`}
            onClick={() => {
              handleTabClick("dashboard");
            }}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </div>
          <div className={styles.relative}>
            <Link href="#">
              <div
                className={`${styles.menu} ${pathname.includes("/courses")
                    ? styles.active
                    : ""
                  }`}
                onClick={() => setDropdown(!dropdown)}
              >
                <CourseIcon />
                <div className={styles.contentAlignment}>
                  <span>Course</span>
                  <div
                    className={dropdown ? styles.toogle : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdown(!dropdown);
                    }}
                  >
                    <DownArrow />
                  </div>
                </div>
              </div>
            </Link>
            <div
              className={classNames(
                styles.dropdown,
                dropdown ? styles.show : styles.hide
              )}
            >
              <div className={styles.dropdownAlignment}>
                <span
                  className={
                    pathname.includes("/pre-recorded") ? styles.activeSubTab : ""
                  }
                  onClick={() => handleTabClick("courses/pre-recorded")}
                >
                  Pre-Recorded
                </span>
                <span
                  className={
                    pathname.includes("/live-online") ? styles.activeSubTab : ""
                  }
                  onClick={() => handleTabClick("courses/live-online")}
                >
                  Live Online
                </span>
                <span
                  className={
                    pathname.includes("/in-person") ? styles.activeSubTab : ""
                  }
                  onClick={() => handleTabClick("courses/in-person")}
                >
                  In-Person
                </span>
              </div>
            </div>
          </div>
          <div className={`${styles.menu} ${pathname === "/algobot" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("algobot")}
          >
            <Algobot />
            <span>AlgoBots</span>
          </div>

          <div className={`${styles.menu} ${pathname === "/my-courses" ? styles.active : ""
            }`}
            onClick={() => {
              handleTabClick("my-courses");
            }}
          >
            <CourseIcon />
            <span>My Courses</span>
          </div>
          {/* <div
              className={`${styles.menu} ${
                pathname === "/notification" ? styles.active : ""
              }`}
              onClick={() => {
                handleTabClick("notification");
              }}
            >
              <NotificationIcon />
              <span>Notifications</span>
            </div> */}
          <div
           className={`${styles.menu} ${pathname === "/paymentHistory" ? styles.active : ""
           }`}
         onClick={() => {
           handleTabClick("telegram");
         }}>
           <TelegramIcon />
            Telegram
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
                {user}
                <img src={DownIcon} alt="DownIcon" />
              </button>
            </div>
            <div
              className={classNames(
                styles.dropdown,
                profileDropdown ? styles.show : styles.hide
              )}
            >
              <div className={styles.dropdownSpacing}>
                <div className={styles.iconText} onClick={() => handleTabClick("profile")}>
                  <ProfileI />
                  <span>Profile</span>
                </div>
                {/* <div className={styles.iconText} onClick={()=>handleTabClick("settings")}>
                    <SettingsIcon />
                    <span>Settings</span>
                  </div> */}
                <div className={styles.iconText} onClick={handleLogout}>
                  <SignoutIcon text="Logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    icon={LogoutIcon}
                    className={styles.logoutButton} />
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
