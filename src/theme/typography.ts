import type { ThemeOptions } from '@mui/material/styles';

const typography: ThemeOptions['typography'] = {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h6: { fontSize: '1rem', fontWeight: 700 }, // page titles used across app
    body2: { color: 'inherit' },
    button: { textTransform: 'none', fontWeight: 600 },
};

export default typography;
