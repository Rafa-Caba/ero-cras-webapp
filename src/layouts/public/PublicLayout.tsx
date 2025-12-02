import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useGalleryStore, useSettingsStore } from '../../store/public';
import { Header } from '../../components/components-public/Header';
import { NavBar } from '../../components/components-public/NavBar';
import { SidebarLeft } from '../../components/components-public/SidebarLeft';
import { SidebarRight } from '../../components/components-public/SidebarRight';
import { Footer } from '../../components/components-public/Footer';


const PublicLayout = () => {
    const { settings, fetchSettings } = useSettingsStore();
    const { images, fetchGallery } = useGalleryStore();

    useEffect(() => {
        fetchSettings();
        fetchGallery();
    }, []);

    useEffect(() => {
        if (settings?.webTitle) {
            document.title = settings.webTitle;
        } else {
            document.title = 'Ero Cras Oficial';
        }

        const logoImage = images.find(img => img.imageLogo);
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;

        if (favicon && logoImage) {
            favicon.href = logoImage.imageUrl || '/images/erocrasLogo.png';
        }
    }, [settings, images]);

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