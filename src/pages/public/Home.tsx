
import '../../assets/styles/layout/_main.scss'; // Adjust if needed
import { MyCarousel } from '../../components-public/MyCarousel';

const HomePage = () => {
    return (
        <div className="px-3">
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
            <div className="images-carousel my-3 w-100">
                <MyCarousel />
            </div>
        </div>
    );
};

export default HomePage;
