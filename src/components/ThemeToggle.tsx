/**
 * Theme toggle button with light/dark/system options
 */

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import CheckIcon from '@mui/icons-material/Check';
import { useThemeMode } from '../context/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: typeof LightModeIcon;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Светлая', icon: LightModeIcon },
  { value: 'dark', label: 'Тёмная', icon: DarkModeIcon },
  { value: 'system', label: 'Системная', icon: SettingsBrightnessIcon },
];

interface ThemeToggleProps {
  iconColor?: string;
}

export default function ThemeToggle({ iconColor = 'inherit' }: Readonly<ThemeToggleProps>) {
  const { mode, resolvedTheme, setMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: ThemeMode) => {
    setMode(value);
    handleClose();
  };

  // Get current icon based on resolved theme
  const CurrentIcon = resolvedTheme === 'dark' ? DarkModeIcon : LightModeIcon;

  return (
    <>
      <Tooltip title="Сменить тему">
        <IconButton
          onClick={handleClick}
          aria-label="Сменить тему"
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ color: iconColor }}
        >
          <CurrentIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <MenuItem
            key={value}
            onClick={() => handleSelect(value)}
            selected={mode === value}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
            {mode === value && (
              <CheckIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
