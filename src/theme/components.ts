// IMPORTANT: enable theme typing for DataGrid overrides
import '@mui/x-data-grid/themeAugmentation';

import type { ThemeOptions } from '@mui/material/styles';

const components: ThemeOptions['components'] = {
    MuiCssBaseline: { /* ... */ },
    MuiPaper: { /* ... */ },
    MuiButton: { /* ... */ },
    MuiTextField: { /* ... */ },
    MuiFormControl: { /* ... */ },
    MuiTableContainer: { /* ... */ },
    // Now TS knows about MuiDataGrid:
    MuiDataGrid: {
        styleOverrides: {
            root: {
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
            },
            columnHeaders: { backgroundColor: 'rgba(0,0,0,0.02)' },
        },
    },
};
export default components;
