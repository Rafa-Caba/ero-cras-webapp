// 🎨 Nuevo useSanitizedTheme para modelo dinámico
// import { useEffect, useState } from 'react';
// import { useThemesStore } from '../store/useThemesStore';
// import type { Theme } from '../types/themes';

// export const useSanitizedTheme = () => {
//     const { themes, loading, getThemes, updateColorClass } = useThemesStore();

//     const [cleanThemes, setCleanThemes] = useState<Theme[]>([]);
//     const [labels, setLabels] = useState<Record<string, string>>({});

//     useEffect(() => {
//         getThemes();
//     }, []);

//     useEffect(() => {
//         if (themes.length > 0) {
//             const clean = themes.filter(({ colorClass, color }) => colorClass && color);
//             setCleanThemes(clean);

//             const labelMap: Record<string, string> = {};
//             clean.forEach(({ colorClass, nombre }) => {
//                 labelMap[colorClass] = nombre;
//             });
//             setLabels(labelMap);
//         }
//     }, [themes]);

//     return {
//         cleanThemes,
//         labels,
//         loading,
//         updateThemes
//     };
// };
