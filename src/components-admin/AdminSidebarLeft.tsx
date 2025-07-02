import jesusito from '/images/jesusito.jpg';

export const AdminSidebarLeft = () => {
    return (
        <aside className="layout-menu-izquierdo d-flex flex-column align-items-center order-2 order-md-0">
            <div className="col-9 my-5">
                <img src={jesusito} className="img-fluid fade-in" alt="Jesusito" />
                <div className='mt-4'>
                    <h3 className='fw-bold'>Noticias</h3>
                    <ul>
                        <li>Hoy es Dia del Amor (Jesus)</li>
                        <li>Nunca te olvides de Dios</li>
                        <li>Dios es Amor!!!</li>
                    </ul>

                </div>
            </div>
        </aside>
    );
};