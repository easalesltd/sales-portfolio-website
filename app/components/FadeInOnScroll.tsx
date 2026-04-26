'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type FadeInDirection = 'up' | 'down' | 'left' | 'right';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  /** Scroll entrance direction (default: up) */
  direction?: FadeInDirection;
}

const distance = 28;

const getVariants = (direction: FadeInDirection) => {
  switch (direction) {
    case 'down':
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };
    case 'left':
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'right':
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'up':
    default:
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
  }
};

export default function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.55,
  className = '',
  direction = 'up',
}: FadeInOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = getVariants(direction);

  // useReducedMotion() is null before hydration; keep motion until explicitly true.
  if (prefersReducedMotion === true) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -48px 0px' }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
