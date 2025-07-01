import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft";
import AdminSidebarRight from "../../components-admin/AdminSidebarRight";
import { AdminEditUser } from "../../components/users/AdminEditUser";


export const EditUser = () => {
    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminEditUser />
            <AdminSidebarRight />
        </main>
    )
};