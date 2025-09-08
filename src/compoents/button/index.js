"use client";
import React from 'react'
import { motion } from 'framer-motion'
import styles from './button.module.scss';

export default function Button({ text, icon, onClick, disabled }) {
  return (
    <div className={styles.button}>
      <motion.button
        aria-label={text}
        onClick={onClick}
        disabled={disabled}
        whileHover={{
          scale: 1.08,
          rotateX: 8,
          rotateY: 8,
          y: 2,
        }}
        whileTap={{
          scale: 0.95,
          rotateX: 0,
          rotateY: 0,
          y: 0
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        {text}
        {
          icon && (
            <motion.img
              src={icon}
              alt="icon"
              whileHover={{
                x: 5,
                y: 2,
                scale: 1.15,
                rotate: 5
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut"
              }}
            />
          )
        }
      </motion.button>
    </div>
  )
}
