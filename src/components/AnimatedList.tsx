/**
 * Animated list with staggered entrance animations
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motion as motionTokens } from '../theme/palette';

interface AnimatedListProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const reducedContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function AnimatedList({
  children,
  staggerDelay = 0.08,
  className,
}: Readonly<AnimatedListProps>) {
  const prefersReducedMotion = useReducedMotion();

  const activeContainerVariants = prefersReducedMotion
    ? reducedContainerVariants
    : {
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      };

  const activeItemVariants = prefersReducedMotion
    ? reducedItemVariants
    : itemVariants;

  const duration = prefersReducedMotion
    ? motionTokens.duration.instant / 1000
    : motionTokens.duration.normal / 1000;

  return (
    <motion.div
      className={className}
      variants={activeContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={activeItemVariants}
          transition={{
            duration,
            ease: motionTokens.easing.easeOut,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Animated list item for use in custom lists
interface AnimatedListItemProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedListItem({
  children,
  delay = 0,
}: Readonly<AnimatedListItemProps>) {
  const prefersReducedMotion = useReducedMotion();

  const duration = prefersReducedMotion
    ? motionTokens.duration.instant / 1000
    : motionTokens.duration.normal / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: motionTokens.easing.easeOut,
      }}
    >
      {children}
    </motion.div>
  );
}
