import { useEffect } from 'react';
import { useThemesStore } from '../store/admin/useThemesStore';

export const useAdminThemeClass = () => {
    const { themes } = useThemesStore();

    useEffect(() => {
        const colorPrimario = themes.find(t => t.nombre === 'Color Primario');
        const className = colorPrimario?.colorClass;

        if (className) {
            // Limpiar cualquier clase anterior de theme
            document.body.classList.forEach((c) => {
                if (c.startsWith('theme-')) document.body.classList.remove(c);
            });

            // Agregar clase basada en colorClass
            document.body.classList.add(`theme-${className}`);
        }
    }, [themes]);
};
