import type { Theme, CreateThemePayload } from "../types/theme";

export const applyThemeToDocument = (theme: Theme | CreateThemePayload) => {
    const root = document.documentElement;

    // Map specific properties to CSS variables
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-card', theme.cardColor);
    root.style.setProperty('--color-button', theme.buttonColor);
    root.style.setProperty('--color-nav', theme.navColor);

    root.style.setProperty('--color-button-text', theme.buttonTextColor);
    root.style.setProperty('--color-secondary-text', theme.secondaryTextColor);
    root.style.setProperty('--color-border', theme.borderColor);
};