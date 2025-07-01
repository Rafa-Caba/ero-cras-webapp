import AdminPanelSection from "../../components-admin/AdminDashboardPanel"
import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"

const Dashboard = () => {
    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminPanelSection />
            <AdminSidebarRight />
        </main>
    )
}

export default Dashboard