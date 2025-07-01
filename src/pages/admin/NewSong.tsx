import { AdminNewSong } from "../../components/cantos/AdminNewSong"
import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"


export const NewSong = () => {
    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminNewSong />
            <AdminSidebarRight />
        </main>
    )
}
