"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./aboutBanner.module.scss";
const AboutImage = "/assets/images/about-banner.png";

export default function AboutBanner() {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={styles.leftrightSpacing}>
      <div className={styles.aboutBanner}>
        <div className="container">
          <div className={styles.grid}>
            <motion.div
              className={styles.griditems}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 variants={textVariants}>About Five Veda</motion.h2>
              <motion.p variants={textVariants} transition={{ delay: 0.2 }}>
                PipsVeda is your one-stop solution for forex success. We offer
                an advanced AlgoBot, expert-led forex courses (recorded, live,
                or in-person), and a premium Telegram channel. Learn, automate,
                and grow your trading skills—all in one place. Easy online
                purchases make it simple to get started today.
              </motion.p>
            </motion.div>
            <div className={styles.griditems}>
              <motion.div
                className={styles.image}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={imageVariants}
              >
                <img src={AboutImage} alt="AboutImage" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
