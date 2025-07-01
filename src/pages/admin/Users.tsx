import { UsersList } from '../../components/users/UsersList';
import AdminSidebarLeft from '../../components-admin/AdminSidebarLeft';
import AdminSidebarRight from '../../components-admin/AdminSidebarRight';

export const Users = () => {
    return (
        <main className="page-main d-flex flex-row w-100 m-0 p-0">
            <AdminSidebarLeft />
            {/* <Container className="py-4"> */}
            <div className='w-100 m-3'>
                <UsersList />
            </div>
            {/* </Container> */}
            <AdminSidebarRight />
        </main>
    );
};
