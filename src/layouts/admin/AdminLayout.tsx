import { Outlet } from 'react-router-dom';
import AdminFooter from '../../components-admin/AdminFooter';
import { AdminHeader } from '../../components-admin/AdminHeader';

const AdminLayout = () => (
    <>
        <AdminHeader />
        <main className="min-h-screen p-6 bg-gray-100">
            <Outlet />
        </main>
        <AdminFooter />
    </>
);

export default AdminLayout;