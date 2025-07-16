import type { ThemeGroupForm } from "../types";

export const applyThemeGroupToDocument = (
    grupo: ThemeGroupForm | { colores: { colorClass: string; color: string }[] }
) => {
    const root = document.documentElement;
    grupo.colores.forEach(({ colorClass, color }) => {
        root.style.setProperty(`--color-${colorClass}`, color);
    });
};