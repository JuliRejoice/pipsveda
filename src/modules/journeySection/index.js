"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./journeySection.module.scss";
import OutlineButton from "@/compoents/outlineButton";
import { getUtilityData } from "@/compoents/api/dashboard";

const JourneyImge = "/assets/images/journey.png";
const MessageIcon = "/assets/icons/message.svg";

// Animation Variants
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function JourneySection() {
  const [telegramLink, setTelegramLink] = useState("#");

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const response = await getUtilityData();
        if (response?.payload?.telegramLink) {
          setTelegramLink(response.payload.telegramLink);
        }
      } catch (error) {
        console.error("Error fetching utility data:", error);
      }
    };

    fetchUtilityData();
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className={styles.journeySection}>
      <div className="container" ref={ref}>
        <div className={styles.grid}>
          {/* Left Grid Content */}
          <div className={styles.griditems}>
            {/* Text Section */}
            <motion.div
              className={styles.text}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h2>You're Not Alone On This Journey</h2>
              <p>
                Get support, share trades, and learn together in our vibrant
                community.
              </p>
            </motion.div>

            {/* Cards Section */}
            <div className={styles.callCardAlignment}>
              <motion.div
                className={styles.card}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <div>
                  <img src={MessageIcon} alt="MessageIcon" />
                </div>
                <div className={styles.cardmiddlecontent}>
                  <h3>Join Telegram Group</h3>
                  <p>
                    Connect with 15,000+ active traders for daily insights and
                    live discussions
                  </p>
                </div>
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OutlineButton text="Visit Forum" />
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Grid Image */}
          <motion.div
            className={styles.griditems}
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className={styles.image}>
              <img src={JourneyImge} alt="JourneyImge" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
