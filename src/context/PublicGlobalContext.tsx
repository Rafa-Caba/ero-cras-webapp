import { createContext, useContext, useEffect } from 'react';
import {
    useGalleryStore,
    useSongStore,
    useSettingsStore,
    useMemberStore,
    useThemeStore
} from '../store/public';

interface Props {
    children: React.ReactNode;
}

const PublicGlobalContext = createContext({});

export const PublicGlobalProvider = ({ children }: Props) => {
    const { fetchGallery } = useGalleryStore();
    const { fetchSongs } = useSongStore();
    const { fetchSettings } = useSettingsStore();
    const { fetchMembers } = useMemberStore();
    const { themes, fetchThemes } = useThemeStore();

    useEffect(() => {
        const loadGlobalData = async () => {
            try {
                await Promise.all([
                    fetchGallery(),
                    fetchSongs(),
                    fetchSettings(),
                    fetchMembers(),
                    fetchThemes()
                ]);
            } catch (error) {
                console.warn("Error loading global public data", error);
            }
        };

        loadGlobalData();
    }, []);

    useEffect(() => {
        if (themes.length > 0) {
            const defaultTheme = themes.find(t => t.name === 'Default');

            if (defaultTheme) {
                const root = document.documentElement;

                root.style.setProperty('--color-primary', defaultTheme.primaryColor);
                root.style.setProperty('--color-accent', defaultTheme.accentColor);
                root.style.setProperty('--color-background', defaultTheme.backgroundColor);
                root.style.setProperty('--color-text', defaultTheme.textColor);
                root.style.setProperty('--color-card', defaultTheme.cardColor);
                root.style.setProperty('--color-button', defaultTheme.buttonColor);
                root.style.setProperty('--color-nav', defaultTheme.navColor);

                root.style.setProperty('--color-button-text', defaultTheme.buttonTextColor);
                root.style.setProperty('--color-secondary-text', defaultTheme.secondaryTextColor);
                root.style.setProperty('--color-border', defaultTheme.borderColor);
            }
        }
    }, [themes]);

    return (
        <PublicGlobalContext.Provider value={{}}>
            {children}
        </PublicGlobalContext.Provider>
    );
};

export const usePublicGlobal = () => useContext(PublicGlobalContext);