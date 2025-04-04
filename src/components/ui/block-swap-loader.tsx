"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlockSwapLoaderProps {
  size?: "sm" | "md" | "lg";
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

const BlockSwapLoader: React.FC<BlockSwapLoaderProps> = ({
  size = "md",
  speed = "normal",
  className,
}) => {
  const [blocks, setBlocks] = useState([0, 1, 2, 3, 4]);
  const [animatingBlocks, setAnimatingBlocks] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Size mapping
  const sizeMap = {
    sm: { blockSize: "w-6 h-6", gap: "gap-0.5" },
    md: { blockSize: "w-8 h-8", gap: "gap-1" },
    lg: { blockSize: "w-10 h-10", gap: "gap-1.5" },
  };

  // Speed mapping (in milliseconds)
  const speedMap = {
    slow: 2000,
    normal: 1500,
    fast: 1000,
  };

  // Animation duration mapping
  const durationMap = {
    slow: 1.5,
    normal: 1,
    fast: 0.7,
  };

  useEffect(() => {
    const swapBlocks = () => {
      const index1 = Math.floor(Math.random() * 5);
      let index2;
      do {
        index2 = Math.floor(Math.random() * 5);
      } while (index2 === index1);

      setAnimatingBlocks([index1, index2]);
      setAnimationKey((prevKey) => prevKey + 1);
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks];
        const temp = newBlocks[index1];
        newBlocks[index1] = newBlocks[index2];
        newBlocks[index2] = temp;
        return newBlocks;
      });
    };

    const intervalId = setInterval(swapBlocks, speedMap[speed]);

    return () => clearInterval(intervalId);
  }, [speed]);

  // Calculate the displacement based on size
  const getDisplacement = () => {
    switch (size) {
      case "sm":
        return 30;
      case "md":
        return 36;
      case "lg":
        return 42;
      default:
        return 36;
    }
  };

  const displacement = getDisplacement();

  return (
    <div
      className={cn(
        `flex items-center justify-center ${sizeMap[size].gap}`,
        className
      )}
    >
      {blocks.map((block, index) => {
        const first = animatingBlocks[0] === index;
        const second = animatingBlocks[1] === index;

        const diff = animatingBlocks[1] - animatingBlocks[0];

        return (
          <motion.div
            key={`${block}-${animationKey}`}
            animate={first ? "up" : second ? "down" : false}
            variants={{
              up: {
                y: [0, -displacement, -displacement, 0],
                x: [0, 0, diff * displacement, diff * displacement],
              },
              down: {
                y: [0, displacement, displacement, 0],
                x: [0, 0, diff * -displacement, diff * -displacement],
              },
            }}
            transition={{
              duration: durationMap[speed],
              repeat: 0,
            }}
            className={cn(`bg-primary rounded-sm`, sizeMap[size].blockSize)}
          />
        );
      })}
    </div>
  );
};

export default BlockSwapLoader;
