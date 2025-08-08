"use client";
import React from "react";
import styles from "./breadcumbs.module.scss";
import RightMdcon from "@/icons/rightMdcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Breadcumbs() {
  const router = useRouter();
  return (
    <div className={styles.breadcumbsAlignment}>
      <Link href="/">Home</Link>
      <RightMdcon />
      <button
        type="button"
        onClick={() => router.back()}
        className="text-blue-600 hover:underline"
      >
        Course
      </button>
      <RightMdcon />
      <span>Pre-Recorded</span>
    </div>
  );
}
