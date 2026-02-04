/**
 * Page transition wrapper using Framer Motion
 * Wraps route content with fade + slide animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motion as motionTokens } from '../theme/palette';

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -12,
  },
};

const reducedVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function PageTransition({ children }: Readonly<PageTransitionProps>) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const activeVariants = prefersReducedMotion ? reducedVariants : variants;
  const duration = prefersReducedMotion
    ? motionTokens.duration.instant / 1000
    : motionTokens.duration.pageTransition / 1000;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={activeVariants}
        transition={{
          duration,
          ease: motionTokens.easing.easeOut,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
