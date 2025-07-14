import {
    usePublicGaleriaStore,
    usePublicCantosStore,
    usePublicSettingsStore,
    usePublicMiembrosStore,
    usePublicThemesStore
} from '../../store/public';

export const PublicTestDashboard = () => {
    const { cantos } = usePublicCantosStore();
    const { imagenes } = usePublicGaleriaStore();
    const { settings } = usePublicSettingsStore();
    const { miembros } = usePublicMiembrosStore();
    const { themes } = usePublicThemesStore();

    return (
        <div style={{ padding: '2rem' }}>
            <h1 className='mb-4'>🧪 Panel Público de Pruebas</h1>

            <section>
                <h2>🎵 Cantos ({cantos.length})</h2>
                <ul>
                    {cantos.slice(0, 5).map(c => (
                        <li key={c._id}>{c.titulo} - {c.tipo}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>🖼️ Galería ({imagenes.length})</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {imagenes.slice(0, 3).map(img => (
                        <img key={img._id} src={img.imagenUrl} alt={img.titulo} width="100" />
                    ))}
                </div>
            </section>

            <section>
                <h2>👥 Miembros ({miembros.length})</h2>
                <ul>
                    {miembros.slice(0, 5).map(m => (
                        <li key={m._id}>{m.nombre} - {m.instrumento}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>⚙️ Settings</h2>
                <pre>{JSON.stringify(settings, null, 2)}</pre>
            </section>

            <section>
                <h2>🎨 Themes ({themes.length})</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {themes.map(t => (
                        <div
                            key={t._id}
                            style={{
                                backgroundColor: t.color,
                                color: '#fff',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                minWidth: '100px',
                                textAlign: 'center'
                            }}
                        >
                            {t.nombre}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
