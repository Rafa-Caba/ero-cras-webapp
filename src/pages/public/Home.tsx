
import SidebarLeft from '../../components-public/SidebarLeft';
import SidebarRight from '../../components-public/SidebarRight';

import '../../assets/styles/layout/_main.scss'; // Adjust if needed
import { MyCarousel } from '../../components-public/MyCarousel';

const HomePage = () => {
    return (
        <main className="main row d-flex w-100 m-0 p-0">
            {/* Sidebar */}
            <SidebarLeft />

            {/* Center Content */}
            <section className="center col-12 col-md-8 d-flex flex-column align-items-center order-0 order-md-1">
                <div className="w-100 px-3" style={{ maxWidth: '1100px' }}>
                    <div className="meaning w-100 d-flex flex-column align-items-center">
                        <h2 className="d-none d-md-block">Ero Cras:</h2>
                        <div className="d-flex flex-wrap flex-lg-nowrap flex-column flex-md-row justify-content-evenly align-items-center">
                            {[
                                'Sabiduría',
                                'Adonai',
                                'Renuevo del tronco de Jesé',
                                'Llave de David',
                                'Sol - Resplandor de eterna Luz',
                                'Rey de las naciones',
                                'Emmanuel'
                            ].map((item, idx) => (
                                <p key={idx} className="border-end border-start border-2">{item}</p>
                            ))}
                        </div>
                    </div>

                    {/* Carousel */}
                    <div className="images-carousel w-100">
                        <MyCarousel />
                    </div>
                </div>
            </section>

            {/* Sidebar */}
            <SidebarRight />
        </main>
    );
};

export default HomePage;
