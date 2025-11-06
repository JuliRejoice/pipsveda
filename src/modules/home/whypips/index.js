"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./whypips.module.scss";

const BottomVec = "/assets/images/bottomvec.png";
const ComputerIcon = "/assets/icons/computer.svg";
const DiscordIcon = "/assets/icons/Discord.svg";
const ReviewsIcon = "/assets/icons/Reviews.svg";
const ResourcesIcon = "/assets/icons/Resources.svg";
const CertificateIcon = "/assets/icons/Certificate.svg";

const cardItems = [
  {
    id: 1,
    icon: ComputerIcon,
    title: "Real-world Trading Simulations",
    description:
      "Practice with live market data in a risk-free environment before investing real money.",
  },
  {
    id: 2,
    icon: DiscordIcon,
    title: "Telegram & Discord Support Channels",
    description:
      "24/7 community support with instant access to mentors and fellow traders.",
  },
  {
    id: 3,
    icon: ReviewsIcon,
    title: "Mentor Feedback & Portfolio Reviews",
    description:
      "Get personalized feedback on your trades and portfolio from experienced professionals.",
  },
  {
    id: 4,
    icon: ResourcesIcon,
    title: "Lifetime Access to Resources",
    description:
      "Once enrolled, enjoy unlimited access to all course materials and future updates.",
  },
  {
    id: 5,
    icon: CertificateIcon,
    title: "Certificate of Completion",
    description:
      "Earn recognized certificates that validate your trading knowledge and skills.",
  },
];

// Animation Variants
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Whypips() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // 3D tilt handlers (no HTML structure changes)
  const maxTilt = 12; // degrees

  const handleMouseEnter = (e) => {
    const el = e.currentTarget;
    el.style.willChange = "transform";
    el.style.transition = "transform 120ms ease-out";
    // Ensure perspective is applied before move
    if (!el.style.transform || !el.style.transform.includes("perspective")) {
      el.style.transform = "perspective(900px)";
    }
  };

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x within element
    const y = e.clientY - rect.top; // y within element

    const px = x / rect.width - 0.5; // -0.5 to 0.5
    const py = y / rect.height - 0.5; // -0.5 to 0.5

    const rotateY = px * (maxTilt * 2); // left(-) to right(+)
    const rotateX = -py * (maxTilt * 2); // top(+) to bottom(-)

    el.style.transition = "transform 40ms linear";
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(
      2
    )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = (e) => {
    const el = e.currentTarget;
    el.style.transition = "transform 180ms ease-out";
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    el.style.willChange = "auto";
  };

  return (
    <div className={styles.whypips}>
      <div className={styles.bottomVec}>
        <img src={BottomVec} alt="BottomVec" />
      </div>

      <div className="container" ref={ref}>
        {/* Title Animation */}
        <motion.div
          className={styles.title}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2>Why Five Veda Trading Academy?</h2>
          <p>
            Our academy bridges the gap between textbook theory and market
            reality. Whether you're a curious novice or a seasoned trader, our
            curriculum adapts to you.
          </p>
        </motion.div>

        {/* Cards Animation */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {cardItems.map((card) => (
            <motion.div
              key={card.id}
              className={styles.griditemsmain}
              variants={cardVariants}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={styles.griditems}>
                <div className={styles.iconCenter}>
                  <img src={card.icon} alt={card.title} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
