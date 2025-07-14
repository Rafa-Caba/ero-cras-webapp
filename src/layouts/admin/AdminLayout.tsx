import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminNav } from '../../components-admin/AdminNav';
import { AdminHeader } from '../../components-admin/AdminHeader';
import { AdminSidebarLeft } from '../../components-admin/AdminSidebarLeft';
import { AdminSidebarRight } from '../../components-admin/AdminSidebarRight';
import { AdminFooter } from '../../components-admin/AdminFooter';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>cargando...</div>;
    if (!user) return <Navigate to="/admin/login" />;

    return (
        <div className="layout-container m-0 p-0">
            <AdminHeader />
            <AdminNav />

            <main className="layout-main">
                <AdminSidebarLeft />

                <section className="layout-content">
                    <Outlet />
                </section>

                <AdminSidebarRight />
            </main>

            <AdminFooter />
        </div>
    );
};

export default AdminLayout;