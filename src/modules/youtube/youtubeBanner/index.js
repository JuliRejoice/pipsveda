import React from "react";
import styles from "./youtubebanner.module.scss";

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function YoutubeBanner() {
  return (
    <div className={styles.leftrightSpacing}>
      <div className={styles.ytBanner}>
        <div className="container">
          <div className={styles.text}>
            <h2>Discover Our Latest Videos</h2>
            <p>
              Learn market strategies, technical analysis, and trading
              tips from our experts to enhance your trading journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
