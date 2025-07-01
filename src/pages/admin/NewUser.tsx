import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"
import { AdminNewUser } from "../../components/users/AdminNewUser"


export const NewUser = () => {
    return (
        <main className="d-flex flex-row m-0 p-0">
            <AdminSidebarLeft />
            <AdminNewUser />
            <AdminSidebarRight />
        </main>
    )
}
