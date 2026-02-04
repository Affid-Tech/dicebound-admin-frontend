/**
 * D20-themed loading spinner with animation
 */

import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { brand, motion as motionTokens } from '../theme/palette';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  showText?: boolean;
}

export default function LoadingSpinner({
  size = 64,
  text = 'Загрузка...',
  showText = true,
}: Readonly<LoadingSpinnerProps>) {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme.palette.mode === 'dark';

  const strokeColor = brand.teal;
  const secondaryColor = brand.lavender;

  const duration = prefersReducedMotion
    ? motionTokens.duration.instant / 1000
    : 2;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Outer ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={isDark ? 'rgba(183, 159, 255, 0.2)' : 'rgba(27, 16, 51, 0.1)'}
          strokeWidth="4"
        />

        {/* Animated arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`url(#gradient-${isDark ? 'dark' : 'light'})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="70 200"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  strokeDashoffset: [0, -283],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* D20 shape in center */}
        <motion.polygon
          points="50,15 75,35 75,65 50,85 25,65 25,35"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinejoin="round"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 1, 0.6],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Inner lines of D20 */}
        <motion.g
          stroke={strokeColor}
          strokeWidth="1.5"
          opacity={0.5}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  opacity: [0.3, 0.7, 0.3],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <line x1="50" y1="15" x2="50" y2="50" />
          <line x1="75" y1="35" x2="50" y2="50" />
          <line x1="75" y1="65" x2="50" y2="50" />
          <line x1="50" y1="85" x2="50" y2="50" />
          <line x1="25" y1="65" x2="50" y2="50" />
          <line x1="25" y1="35" x2="50" y2="50" />
        </motion.g>

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id={`gradient-${isDark ? 'dark' : 'light'}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={brand.teal} />
            <stop offset="50%" stopColor={brand.purple} />
            <stop offset="100%" stopColor={brand.lavender} />
          </linearGradient>
        </defs>
      </motion.svg>

      {showText && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
}
