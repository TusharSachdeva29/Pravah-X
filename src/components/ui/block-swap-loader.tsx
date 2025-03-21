
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BlockSwapLoader: React.FC = () => {
  const [blocks, setBlocks] = useState([0, 1, 2, 3, 4]);
  const [animatingBlocks, setAnimatingBlocks] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

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

    const intervalId = setInterval(swapBlocks, 1500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1">
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
                y: [0, -36, -36, 0],
                x: [0, 0, diff * 36, diff * 36],
              },
              down: {
                y: [0, 36, 36, 0],
                x: [
                  0,
                  0,
                  diff * -36,
                  diff * -36,
                ],
              },
            }}
            transition={{
              duration: 1,
              repeat: 0,
            }}
            className="w-8 h-8 bg-primary rounded-sm"
          />
        );
      })}
    </div>
  );
};

export default BlockSwapLoader;
