import { Outlet } from 'react-router-dom';
import Header from '../../components-public/Header';
import Footer from '../../components-public/Footer';

const PublicLayout = () => (
    <div className="d-flex flex-column min-vh-100 w-100"> {/* Forza 100% alto y ancho */}
        <Header />
        <main className="flex-grow-1"> {/* Ocupa todo el espacio restante */}
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default PublicLayout;