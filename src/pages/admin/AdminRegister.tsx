import AdminFooter from '../../components-admin/AdminFooter';
import { RegisterUser } from '../../components/users/RegisterUser';

const AdminRegister = () => {
    return (
        <div className="container" style={{ minWidth: '100vw' }}>
            <header className="row">
                <div className="titulo-nav px-0 col-12 d-flex flex-column">
                    <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                        <div className="titulo text-center text-md-start mt-3">
                            <h1 className="d-none d-md-block">Ero Cras Oficial - Admin</h1>
                            <h1 className="d-block d-md-none">Ero Cras Oficial<br />Admin</h1>
                        </div>
                    </div>
                </div>
            </header>

            <RegisterUser />

            <AdminFooter />
        </div>
    );
};

export default AdminRegister;
