/**
 * Glassmorphism card component with hover animations
 */

import { motion } from 'framer-motion';
import { Box, type SxProps, type Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { glass, radii, motion as motionTokens } from '../theme/palette';

interface GlassCardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  glowColor?: string;
  padding?: number | string;
  borderRadius?: number;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  hoverable = true,
  glowColor,
  padding = 3,
  borderRadius = radii.xl,
  sx,
  onClick,
}: Readonly<GlassCardProps>) {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme.palette.mode === 'dark';

  const glassBackground = isDark
    ? 'rgba(27, 16, 51, 0.65)'
    : 'rgba(255, 255, 255, 0.65)';

  const glassBorder = isDark
    ? 'rgba(183, 159, 255, 0.15)'
    : 'rgba(255, 255, 255, 0.4)';

  const defaultGlow = isDark
    ? 'rgba(40, 216, 196, 0.25)'
    : 'rgba(40, 216, 196, 0.15)';

  const glow = glowColor ?? defaultGlow;

  const hoverAnimation = hoverable && !prefersReducedMotion
    ? {
        y: -4,
        boxShadow: `0 8px 32px ${glow}`,
      }
    : {};

  const duration = prefersReducedMotion
    ? motionTokens.duration.instant / 1000
    : motionTokens.duration.fast / 1000;

  return (
    <motion.div
      whileHover={hoverAnimation}
      transition={{ duration, ease: motionTokens.easing.easeOut }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <Box
        sx={{
          background: glassBackground,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: `1px solid ${glassBorder}`,
          borderRadius: `${borderRadius}px`,
          boxShadow: isDark
            ? '0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 4px 16px rgba(12, 8, 21, 0.08)',
          overflow: 'hidden',
          p: padding,
          ...sx,
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
}
