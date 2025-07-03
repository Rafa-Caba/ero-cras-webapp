// App.tsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/public/PublicLayout';
import AdminLayout from './layouts/admin/AdminLayout';

import HomePage from './pages/public/Home';
import Contact from './pages/public/Contact';
import Miembros from './pages/public/Miembros';
import MisaErocrasPage from './pages/public/MisaErocras';

import Dashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import NosotrosPage from './pages/public/Nosotros';

import './assets/styles/global.scss';

import AdminRegister from './pages/admin/AdminRegister';
import Canto from './pages/admin/Canto';
import EditCanto from './pages/admin/EditCanto';
import Gallery from './pages/admin/Gallery';
import { Photo } from './pages/admin/Photo';
import { NewImage } from './pages/admin/NewImage';
import { NewSong } from './pages/admin/NewSong';
import { Users } from './pages/admin/Users';
import { NewUser } from './pages/admin/NewUser';
import { EditUser } from './pages/admin/EditUser';
import { PrivateRoute } from './components/PrivateRoute';
import { EditPhoto } from './pages/admin/EditPhoto';
import { Cantos } from './pages/admin/Cantos';
import { ThemesPage } from './pages/admin/ThemesPage';
import { useThemesStore } from './store/useThemesStore';
import { NewColorTheme } from './pages/admin/NewColorTheme';
import { AdminEditColorTheme } from './components/themes/AdminEditColorTheme';

function App() {
    const { themes, getThemes } = useThemesStore();
    // Cargar tema al montar la app
    useEffect(() => {
        getThemes();
    }, []);

    // Estilos dinámicos basados en el tema
    useEffect(() => {
        if (themes.length > 0) {
            const root = document.documentElement;
            themes.forEach(({ colorClass, color }) => {
                root.style.setProperty(`--color-${colorClass}`, color);
            });
        }
    }, [themes]);

    return (
        <div>
            <Routes>
                {/* Public Section */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="miembros" element={<Miembros />} />
                    <Route path="misa-erocras" element={<MisaErocrasPage />} />
                    <Route path="nosotros" element={<NosotrosPage />} />
                </Route>

                {/* Admin Section */}
                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="edit_user/:id" element={<EditUser />} />
                    <Route path="users/new_user" element={<NewUser />} />
                    <Route path="cantos" element={<Cantos />} />
                    <Route path="canto/:id" element={<Canto />} />
                    <Route path="edit_canto/:id" element={<EditCanto />} />
                    <Route path="cantos/new_song" element={<NewSong />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="photo/:id" element={<Photo />} />
                    <Route path="edit_imagen/:id" element={<EditPhoto />} />
                    <Route path="gallery/new_image" element={<NewImage />} />
                    <Route path="themes" element={<ThemesPage />} />
                    <Route path="edit_class_color/:id" element={<AdminEditColorTheme />} />
                    <Route path="themes/new_class_color" element={<NewColorTheme />} />
                </Route>

                {/* Login (outside layout) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/registrate" element={<AdminRegister />} />

            </Routes>
        </div>
    );
}

export default App;
