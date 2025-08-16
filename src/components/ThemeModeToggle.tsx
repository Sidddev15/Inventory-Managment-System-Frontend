import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useThemeMode } from '../theme';

const ThemeModeToggle: React.FC = () => {
  const { mode, toggle } = useThemeMode();
  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}>
      <IconButton onClick={toggle} size="small" aria-label="toggle theme">
        {mode === 'light' ? (
          <DarkModeOutlinedIcon fontSize="small" />
        ) : (
          <LightModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeModeToggle;
