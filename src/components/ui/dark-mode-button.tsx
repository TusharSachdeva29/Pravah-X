"use client";

import { motion } from "framer-motion";
import React from "react";

interface DayNightToggleButtonProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  size?: number;
}

export default function DayNightToggleButton({
  dark,
  setDark,
}: DayNightToggleButtonProps) {
  return (
    <motion.div
      onClick={() => setDark(!dark)}
      className="relative flex items-center justify-between w-32 h-12 p-2 rounded-full cursor-pointer overflow-hidden"
      animate={dark ? "night" : "day"}
      initial="day"
      variants={{
        day: { background: "linear-gradient(135deg, #87CEEB, #00BFFF)" },
        night: { background: "linear-gradient(135deg, #4e54c8, #8f94fb)" },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <MoonSun dark={dark} />
      {dark ? <Stars /> : <Clouds />}
    </motion.div>
  );
}

function MoonSun({ dark }: { dark: boolean }) {
  return (
    <motion.div
      className={`w-10 h-10 rounded-full relative ${
        dark ? "bg-gray-200" : "bg-yellow-400"
      }`}
      animate={dark ? { x: "-4px" } : { x: "76px" }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{
        boxShadow: dark
          ? "0px 0px 0px rgba(0, 0, 0, 0.3)"
          : "0px 0px 10px 2px rgba(255, 204, 0, 0.6), 0px 0px 15px 4px rgba(255, 204, 0, 0.4)",
      }}
    />
  );
}

function Clouds() {
  // Cloud animation variants
  const cloudVariant = {
    animate: {
      x: [0, 5, 0],
      y: [0, -2, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  // Array of cloud positions and sizes for diversity
  const clouds = [
    { top: 2, left: -5, width: 40, height: 40, delay: 0 },
    { top: 4, left: 10, width: 30, height: 30, delay: 0.5 },
    { top: 1, left: 25, width: 35, height: 35, delay: 1 },
  ];

  return (
    <div className="absolute inset-0">
      {clouds.map((cloud, index) => (
        <motion.svg
          key={index}
          className="absolute rounded-full lucide lucide-cloud"
          viewBox="0 0 50 50"
          fill="#FFF"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            top: `${cloud.top}px`,
            left: `${cloud.left}px`,
          }}
          animate={{
            x: [0, 5, 0],
            y: [0, -2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            delay: cloud.delay,
          }}
          width={cloud.width}
          height={cloud.height}
        >
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </motion.svg>
      ))}
    </div>
  );
}

function Stars() {
  // Star animation variant for pulsating effect
  const starVariant = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  // Multiple stars with different positions and delays
  const stars = [
    { top: 8, right: 60, size: 8, delay: 0 },
    { top: 2, right: 20, size: 6, delay: 0.3 },
    { top: 14, right: 10, size: 7, delay: 0.6 },
    { top: 4, right: 40, size: 5, delay: 0.9 },
  ];

  return (
    <div className="absolute inset-0">
      {stars.map((star, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute lucide lucide-star"
          style={{
            top: `${star.top}px`,
            right: `${star.right}px`,
          }}
          width={star.size}
          height={star.size}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: star.delay,
          }}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </motion.svg>
      ))}
    </div>
  );
}
