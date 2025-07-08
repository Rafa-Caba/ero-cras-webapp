import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { usePublicGaleriaStore, usePublicSettingsStore } from '../../store/public';
import { Header } from '../../components-public/Header';
import { NavBar } from '../../components-public/NavBar';
import { SidebarLeft } from '../../components-public/SidebarLeft';
import { SidebarRight } from '../../components-public/SidebarRight';
import { Footer } from '../../components-public/Footer';

const PublicLayout = () => {
    const { settings, fetchSettingsPublicos } = usePublicSettingsStore();
    const { imagenes, fetchImagenesPublicas } = usePublicGaleriaStore();

    useEffect(() => {
        fetchSettingsPublicos();
        fetchImagenesPublicas();
    }, []);

    useEffect(() => {
        if (settings?.tituloWeb) {
            document.title = settings.tituloWeb;
        } else {
            document.title = 'Ero Cras Oficial';
        }

        const imagenLogo = imagenes.find(img => img.imagenLogo);
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;

        if (favicon && imagenLogo) {
            favicon.href = imagenLogo?.imagenUrl || '/images/erocrasLogo.png';
        }
    }, [settings, imagenes]);

    return (
        <div className="layout-container">
            <Header />
            <NavBar />

            <main className="layout-main">
                <SidebarLeft />

                <section className="layout-content">
                    <Outlet />
                </section>

                <SidebarRight />
            </main>

            <Footer />
        </div>
    )
};

export default PublicLayout;