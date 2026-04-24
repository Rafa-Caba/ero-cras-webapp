// src/theme/mui/MuiAppThemeProvider.tsx

import { useMemo, type ReactNode } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PaletteMode, Theme } from '@mui/material/styles';

import { createMuiAppTheme } from './createMuiAppTheme';

interface MuiAppThemeProviderProps {
    children: ReactNode;
    mode?: PaletteMode;
    disableCssBaseline?: boolean;
}

export const MuiAppThemeProvider = ({
    children,
    mode = 'light',
    disableCssBaseline = false,
}: MuiAppThemeProviderProps) => {
    const theme: Theme = useMemo(() => createMuiAppTheme({ mode }), [mode]);

    return (
        <ThemeProvider theme={theme}>
            {!disableCssBaseline && <CssBaseline />}
            {children}
        </ThemeProvider>
    );
};