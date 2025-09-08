"use client";
import React from "react";
import styles from "./breadcumbs.module.scss";
import RightMdcon from "@/icons/rightMdcon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Breadcumbs() {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const redirect = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    // Redirect to /courses/pre-recorded if path matches certain conditions
    if (pathSegments[0] === 'course') {
      router.push('/course');
    }
    else if(pathSegments[0] === 'algobot' ){
      router.push('/algobot');
    }
    else if(pathSegments[0] === 'telegram'){
      router.push('/telegram');
    }
    else{
      router.back()
    }
  };

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
          <button type="button" onClick={() => redirect()} className={styles.breadcrumbLink}>
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
