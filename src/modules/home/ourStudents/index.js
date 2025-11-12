"use client";
import React, { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import styles from "./ourStudents.module.scss";
import Slider from "react-slick";
import StarIcon from "@/icons/starIcon";
import Arrowicon from "@/icons/arrowicon";
import classNames from "classnames";

const SqureIcon = "/assets/icons/Group.svg";

const testimonials = [
  {
    id: 1,
    quote:
      "The strategies taught here transformed my trading completely. I guidance helped me refine my trading went from losing money to consistent profits in just 3 months.",
    name: "Rajesh Kumar",
    role: "Forex Trading Five Veda",
    profit: "+₹2.8L in 6 months",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "The mentorship program was a game-changer for me. The personalized guidance helped me refine my trading strategy and improve my risk management.",
    name: "Priya Sharma",
    role: "Swing Trading Student",
    profit: "+₹1.5L in 4 months",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "The community support and daily market analysis have been invaluable. I've gained confidence in my trading decisions and seen consistent growth in my portfolio.",
    name: "Amit Patel",
    role: "Intraday Trading Enthusiast",
    profit: "+₹3.2L in 8 months",
    rating: 4,
  },
  {
    id: 4,
    quote:
      "The structured learning path made complex concepts easy to understand. I went from a complete beginner to making my first profitable trade in just 6 weeks.",
    name: "Neha Gupta",
    role: "Beginner Trader",
    profit: "+₹95K in 3 months",
    rating: 5,
  },
];

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className={classNames(styles.arrow, styles.rightIcon)}
      onClick={onClick}
    >
      <Arrowicon />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className={classNames(styles.arrow, styles.leftIcon)}
      onClick={onClick}
    >
      <Arrowicon />
    </div>
  );
}

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
    transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

export default function OurStudents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Hover tilt state
  const [hoveredCardId, setHoveredCardId] = React.useState(null);
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    const rotateMax = 10; // intensity
    const rotateY = (x - 0.5) * 2 * rotateMax; // left/right
    const rotateX = -(y - 0.5) * 2 * rotateMax; // top/bottom

    setHoveredCardId(id);
    setTilt({ rotateX, rotateY, scale: 1.03 });
  };

  const handleMouseLeave = () => {
    setHoveredCardId(null);
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.ourStudents}>
      <div className="container" ref={ref}>
        {/* Title animation */}
        <motion.div
          className={styles.text}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2>What Our Students Say</h2>
          <p>Real success stories from our trading community</p>
        </motion.div>

        <Slider {...settings}>
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              onMouseMove={(e) => handleMouseMove(e, testimonial.id)}
              onMouseLeave={handleMouseLeave}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                mass: 0.5,
              }}
              style={{
                transformPerspective: 800,
                transformStyle: "preserve-3d",
                rotateX: hoveredCardId === testimonial.id ? tilt.rotateX : 0,
                rotateY: hoveredCardId === testimonial.id ? tilt.rotateY : 0,
                scale: hoveredCardId === testimonial.id ? tilt.scale : 1,
                willChange: "transform",
              }}
            >
              <div className={styles.whiteBox}>
                <img src={SqureIcon} alt="SqureIcon" />
                <p>"{testimonial.quote}"</p>
                <div className={styles.contentAlignment}>
                  <div className={styles.ratingAlignment}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <span>💰 {testimonial.profit}</span>
                </div>
                <div className={styles.profilealignment}>
                  <div className={styles.profile}>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
