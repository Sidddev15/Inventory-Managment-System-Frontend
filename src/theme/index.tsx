import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import components from './components';
import typography from './typography';
import { darkPalette, lightPalette } from './palette';

type ThemeModeCtx = {
  mode: PaletteMode;
  toggle: () => void;
  setMode: (m: PaletteMode) => void;
};

const ThemeModeContext = createContext<ThemeModeCtx>({
  mode: 'light',
  toggle: () => {},
  setMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

const STORAGE_KEY = 'ui-theme-mode';

export const ThemeProviderWithMode: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // load preference
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
    if (stored === 'light' || stored === 'dark') setMode(stored);
  }, []);

  // persist preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme-mode', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => {
    const paletteTokens = mode === 'light' ? lightPalette : darkPalette;
    return createTheme({
      palette: { mode, ...paletteTokens },
      typography,
      components,
      shape: { borderRadius: 10 },
      spacing: 8, // 8px grid
    });
  }, [mode]);

  const ctx = useMemo(() => ({ mode, toggle, setMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={ctx}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};
