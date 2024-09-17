import React, { useContext } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AppContext } from '../context/AppContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(AppContext);

  return (
    <ToggleButtonGroup
      value={darkMode}
      exclusive
      onChange={toggleDarkMode}
      aria-label="theme toggle"
    >
      <ToggleButton value={true} aria-label="dark mode">
        <DarkModeIcon />
      </ToggleButton>
      <ToggleButton value={false} aria-label="light mode">
        <LightModeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default React.memo(ThemeToggle);