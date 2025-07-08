import { useEffect } from 'react';
import { usePublicThemesStore } from '../store/public';

export const useThemeClass = () => {
    const { themes } = usePublicThemesStore();

    useEffect(() => {
        const colorPrimario = themes.find(t => t.nombre === 'Color Primario');
        const className = colorPrimario?.colorClass;

        if (className) {
            // Limpiamos clases previas que empiecen con 'theme-'
            document.body.classList.forEach(c => {
                if (c.startsWith('theme-')) document.body.classList.remove(c);
            });

            // Agregamos la nueva
            document.body.classList.add(`theme-${className}`);
        }
    }, [themes]);
};
