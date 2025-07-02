import { Outlet } from 'react-router-dom';

import { Header } from '../../components-public/Header';
import { NavBar } from '../../components-public/NavBar';
import { SidebarLeft } from '../../components-public/SidebarLeft';
import { SidebarRight } from '../../components-public/SidebarRight';
import { Footer } from '../../components-public/Footer';

const PublicLayout = () => (
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
);

export default PublicLayout;