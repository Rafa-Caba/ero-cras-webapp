import cruzLogo from '/images/ero-cras-cruz.png';
import eroLogo from '/images/2019.png';

const AdminSidebarRight = () => {
    return (
        <section className="logo col-12 col-md-2 d-flex flex-column align-content-start order-1 order-md-2">
            <div className="logo-contenedor d-flex flex-column align-items-center justify-content-between h-100">
                <div className="logo-img my-4 fade-in">
                    <img className="img-fluid" src={cruzLogo} alt="Ero Cras" />
                </div>

                <div className="logo-img my-4 mt-auto mx-3 fade-in">
                    <img className="img-fluid" src={eroLogo} alt="Ero Cras" />
                </div>
            </div>
        </section>
    );
};

export default AdminSidebarRight;
