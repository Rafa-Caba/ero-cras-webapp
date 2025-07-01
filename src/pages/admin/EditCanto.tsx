import AdminEditCanto from "../../components/cantos/AdminEditCanto"
import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"


const EditCanto = () => {
    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminEditCanto />
            <AdminSidebarRight />
        </main>
    )
}

export default EditCanto