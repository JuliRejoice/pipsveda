"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./aboutPipsVeda.module.scss";

const CardImage = "/assets/images/about-pipsveda.png";
const CheckIcon = "/assets/icons/check-pri.svg";

const aboutPoints = [
  "Expert-led courses for all skill levels",
  "Access to our premium Telegram channel",
  "Easy online purchases for quick access",
  "Learn from the best in the forex industry",
];

export default function AboutPipsVeda() {
  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerItems = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const imageAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, backgroundColor: "transparent" }}
      whileInView={{ opacity: 1, backgroundColor: "#000" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={styles.aboutPipsVeda}
    >
      <div className="container">
        <motion.div
          className={styles.grid}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.griditems}>
            <motion.div className={styles.image} {...imageAnimation}>
              <img src={CardImage} alt="CardImage" />
            </motion.div>
          </div>
          <motion.div className={styles.griditems} variants={staggerItems}>
            <motion.h2 variants={fadeInUp}>About Five Veda</motion.h2>
            <motion.p variants={fadeInUp}>
              PipsVeda is your one-stop solution for forex success. We offer an
              advanced AlgoBot, expert-led forex courses (recorded, live, or
              in-person), and a premium Telegram channel. Learn, automate, and
              grow your trading skills—all in one place. Easy online purchases
              make it simple to get started today.
            </motion.p>
            {aboutPoints.map((point, index) => (
              <motion.div
                key={index}
                className={styles.iconText}
                variants={fadeInUp}
              >
                <img src={CheckIcon} alt="CheckIcon" />
                <span>{point}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
