import { Link } from 'react-router-dom';
import { AdminFooter } from '../../components-admin/AdminFooter';
import { RegisterUser } from '../../components/users/RegisterUser';

export const AdminRegister = () => {
    return (
        <div>
            <header className="layout-header">
                <div className="titulo-nav px-0 col-12 d-flex flex-column">
                    <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                        <div className="titulo text-center text-md-start d-flex flex-column flex-md-row justify-content-between mt-3 w-100">
                            <h2 className="">Ero Cras Oficial - Admin</h2>
                            <Link className="btn general_btn mt-3 mt-md-0 mb-md-2 fw-bold fs-6 fs-md-5" to="/">Ir al Inicio</Link>
                        </div>
                    </div>
                </div>
            </header>

            <RegisterUser />

            <AdminFooter />
        </div>
    );
};