import AdminCantosSection from "../../components/cantos/AdminCantosSection"
import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"

export const Cantos = () => {
    return (
        <main className="page-main row d-flex w-100 m-0 p-0">
            <AdminSidebarLeft />
            <AdminCantosSection />
            <AdminSidebarRight />
        </main>
    )
}