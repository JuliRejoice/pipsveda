"use client";
import React from "react";
import styles from "./breadcumbs.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Breadcumbs() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.breadcumbsAlignment}>
      <button 
        onClick={handleGoBack} 
        className={styles.backButton}
        aria-label="Go back"
      >
        <Image 
          src="/assets/icons/back.svg" 
          alt="" 
          width={24} 
          height={24} 
          className={styles.backIcon}
        />
        Back
      </button>
    </div>
  );
}
