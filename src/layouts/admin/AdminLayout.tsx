import { Navigate, Outlet } from 'react-router-dom';
import { AdminHeader } from '../../components/components-admin/AdminHeader';
import { AdminNav } from '../../components/components-admin/AdminNav';
import { AdminSidebarLeft } from '../../components/components-admin/AdminSidebarLeft';
import { AdminSidebarRight } from '../../components/components-admin/AdminSidebarRight';
import { AdminFooter } from '../../components/components-admin/AdminFooter';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>cargando...</div>;
    if (!user) return <Navigate to="/auth/login" />;

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