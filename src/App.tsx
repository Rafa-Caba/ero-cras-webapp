// App.tsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/public/PublicLayout';
import AdminLayout from './layouts/admin/AdminLayout';

import HomePage from './pages/public/Home';
import Contact from './pages/public/Contact';
import { Miembros } from './pages/public/Miembros';
import { MisaPage } from './pages/public/Misa';

import Dashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import NosotrosPage from './pages/public/Nosotros';

import './assets/styles/global.scss';

import { AdminRegister } from './pages/admin/AdminRegister';
import { Canto } from './pages/admin/Canto';
import { EditCanto } from './pages/admin/EditCanto';
import { Gallery } from './pages/admin/Gallery';
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
import { NewColorTheme } from './pages/admin/NewColorTheme';
import { AdminEditColorTheme } from './components/themes/AdminEditColorTheme';
import { Members } from './pages/admin/Members';
import { EditMember } from './pages/admin/EditMember';
import { NewMember } from './pages/admin/NewMember';
import { BlogPosts } from './pages/admin/BlogPosts';
import { EditBlogPost } from './pages/admin/EditBlogPost';
import { NewBlogPost } from './pages/admin/NewBlogPost';
import { Announcements } from './pages/admin/Announcements';
import { EditAnnouncement } from './pages/admin/EditAnnouncement';
import { NewAnnouncement } from './pages/admin/NewAnnouncement';
import { BlogPostsView } from './pages/admin/BlogPostsView';
import { AdminBlogPostSingleView } from './components/blogPosts/AdminBlogPostSingleView';
import { WebsiteSettings } from './pages/admin/WebsiteSettings';
import { PublicGlobalProvider } from './context/PublicGlobalContext';
import { PublicDashboard } from './pages/public/PublicDashboard';
import { usePublicThemesStore } from './store/public';
import { GlobalAppProvider } from './context/GlobalAppContext';

function App() {
    const { themes, fetchThemesPublicos } = usePublicThemesStore();
    // Cargar tema al montar la app
    useEffect(() => {
        fetchThemesPublicos();
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
                <Route path="/" element={
                    <PublicGlobalProvider>
                        <PublicLayout />
                    </PublicGlobalProvider>
                }>
                    <Route index element={<HomePage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="miembros" element={<Miembros />} />
                    <Route path="misa" element={<MisaPage />} />
                    <Route path="nosotros" element={<NosotrosPage />} />
                    <Route path="public-test" element={<PublicDashboard />} />
                </Route>

                {/* Admin Section */}
                <Route path="/admin" element={
                    <GlobalAppProvider>
                        <PrivateRoute>
                            <AdminLayout />
                        </PrivateRoute>
                    </GlobalAppProvider>
                }>
                    <Route index element={<Dashboard />} />

                    <Route path="users" element={<Users />} />
                    <Route path="users/edit/:id" element={<EditUser />} />
                    <Route path="users/new_user" element={<NewUser />} />

                    <Route path="cantos" element={<Cantos />} />
                    <Route path="canto/:id" element={<Canto />} />
                    <Route path="cantos/edit/:id" element={<EditCanto />} />
                    <Route path="cantos/new_song" element={<NewSong />} />

                    <Route path="gallery" element={<Gallery />} />
                    <Route path="photo/:id" element={<Photo />} />
                    <Route path="gallery/edit/:id" element={<EditPhoto />} />
                    <Route path="gallery/new_image" element={<NewImage />} />

                    <Route path="themes" element={<ThemesPage />} />
                    <Route path="edit_class_color/:id" element={<AdminEditColorTheme />} />
                    <Route path="themes/new_class_color" element={<NewColorTheme />} />

                    <Route path="members" element={<Members />} />
                    <Route path="members/edit/:id" element={<EditMember />} />
                    <Route path="members/new_member" element={<NewMember />} />

                    <Route path="blogposts" element={<BlogPosts />} />
                    <Route path="blogposts/edit/:id" element={<EditBlogPost />} />
                    <Route path="blogposts/new_blogpost" element={<NewBlogPost />} />

                    <Route path="announcements" element={<Announcements />} />
                    <Route path="announcements/edit/:id" element={<EditAnnouncement />} />
                    <Route path="announcements/new_announcement" element={<NewAnnouncement />} />

                    <Route path="blog_posts" element={<BlogPostsView />} />
                    <Route path="blog_posts/:id" element={<AdminBlogPostSingleView />} />

                    <Route path="website_settings" element={<WebsiteSettings />} />
                </Route>

                {/* Login (outside layout) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/registrate" element={<AdminRegister />} />

            </Routes>
        </div>
    );
}

export default App;
