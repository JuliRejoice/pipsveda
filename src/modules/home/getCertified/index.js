"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./getCertified.module.scss";
import CheckIcon from "@/icons/checkIcon";

const WinIcon = "/assets/icons/win-new.svg";
const SampleIcon = "/assets/icons/shield.svg";
const LinkdinIcon = "/assets/icons/linkdin.svg";

// Animation Variants
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function GetCertified() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, backgroundColor: "transparent" }}
      whileInView={{ opacity: 1, backgroundColor: "#000" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={styles.getCertified}
    >
      <div className="container" ref={ref}>
        {/* Section Title */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2>Get Certified by Five Veda Trading Academy</h2>
          <p>
            Showcase formal credibility with industry-recognized certifications
          </p>
        </motion.div>

        {/* Cards */}
        <div className={styles.grid}>
          
            <motion.div
              
              className={styles.griditems}
              variants={cardVariants}
              
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
          
                <div className={styles.card}>
                  <div className={styles.iconText}>
                    <img src={WinIcon} alt="WinIcon" />
                    <h3>Professional Trading Certification</h3>
                  </div>
                  <p>
                    Upon successful completion of our courses, receive
                    certificates that validate your trading knowledge and
                    skills. Our certifications are recognized in the financial
                    industry.
                  </p>
                  <div className={styles.allIconText}>
                    <div className={styles.iconText}>
                      <CheckIcon />
                      <span>Verified on LinkedIn & Professional Networks</span>
                    </div>
                    <div className={styles.iconText}>
                      <CheckIcon />
                      <span>Industry-recognized credentials</span>
                    </div>
                    <div className={styles.iconText}>
                      <CheckIcon />
                      <span>Lifetime validity</span>
                    </div>
                  </div>
                </div>
               
            </motion.div>
    
        </div>
      </div>
    </motion.div>
  );
}
