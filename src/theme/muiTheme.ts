/**
 * Theme exports for backwards compatibility
 * Use lightTheme/darkTheme directly for new code
 */

import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

// Re-export individual themes
export { default as lightTheme } from './lightTheme';
export { default as darkTheme } from './darkTheme';

// Re-export design tokens
export * from './palette';
export * from './typography';
export * from './components';

// Default export is light theme for backwards compatibility
const theme = lightTheme;
export default theme;

// Theme type union
export type AppTheme = typeof lightTheme | typeof darkTheme;
