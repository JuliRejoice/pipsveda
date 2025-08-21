"use client";
import React from "react";
import styles from "./breadcumbs.module.scss";
import RightMdcon from "@/icons/rightMdcon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Breadcumbs() {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  // Format the breadcrumb text (e.g., 'pre-recorded' -> 'Pre Recorded')
  const formatBreadcrumb = (segment) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    // Skip numeric segments (like course IDs)
    if (/^\d+$/.test(segment)) return null; 
    
    const isLast = index === pathSegments.length - 1;
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const displayText = formatBreadcrumb(segment);

    return (
      <React.Fragment key={segment}>
        {!isLast && <RightMdcon />}
        {!isLast && (
          <button type="button" onClick={() => router.back()} className={styles.breadcrumbLink}>
            {displayText}
          </button>
        )}
      </React.Fragment>
    );
  }).filter(Boolean); // Remove any null values

  return (
    <div className={styles.breadcumbsAlignment}>
      <Link href="/dashboard" className={styles.breadcrumbLink}>
        Home
      </Link>
      {breadcrumbs}
    </div>
  );
}
