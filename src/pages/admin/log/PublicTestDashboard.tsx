import { useEffect } from 'react';
import {
    useGalleryStore,
    useSongStore,
    useSettingsStore,
    useMemberStore,
    useThemeStore
} from '../../../store/public';

export const PublicTestDashboard = () => {
    const { songs, fetchSongs } = useSongStore();
    const { images, fetchGallery } = useGalleryStore();
    const { settings, fetchSettings } = useSettingsStore();
    const { members, fetchMembers } = useMemberStore();
    const { themes, fetchThemes } = useThemeStore();

    useEffect(() => {
        const loadAllPublicData = async () => {
            await Promise.all([
                fetchSongs(),
                fetchGallery(),
                fetchSettings(),
                fetchMembers(),
                fetchThemes()
            ]);
        };

        loadAllPublicData();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '100%', overflowX: 'hidden' }}>
            <h1 className='mb-4'>🧪 Panel Público de Pruebas</h1>

            <section className="mb-5">
                <h2>🎵 Cantos ({songs.length})</h2>
                <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {songs.slice(0, 5).map(c => (
                        <li key={c.id}>{c.title} - {c.songTypeName}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-5">
                <h2>🖼️ Galería ({images.length})</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {images.slice(0, 3).map(img => (
                        <img
                            key={img.id}
                            src={img.imageUrl}
                            alt={img.title}
                            width="150"
                            style={{ borderRadius: 8, objectFit: 'cover' }}
                        />
                    ))}
                </div>
            </section>

            <section className="mb-5">
                <h2>👥 Miembros ({members.length})</h2>
                <ul>
                    {members.slice(0, 5).map(m => (
                        <li key={m.id}>{m.name} - {m.instrument}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-5">
                <h2>⚙️ Settings</h2>
                <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8 }}>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                        {JSON.stringify(settings, null, 2)}
                    </pre>
                </div>
            </section>

            <section className="mb-5">
                <h2>🎨 Themes ({themes.length})</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {themes.map(t => (
                        <div
                            key={t.id}
                            style={{
                                backgroundColor: t.primaryColor,
                                color: t.buttonTextColor || '#fff',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                minWidth: '120px',
                                textAlign: 'center',
                                border: '1px solid #ccc'
                            }}
                        >
                            <strong>{t.name}</strong>
                            <br />
                            <small>{t.isDark ? 'Dark' : 'Light'}</small>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};