
import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import CantoModal from "./CantoModal";
import { usePublicCantosStore } from "../store/public/usePublicCantosStore";

const tiposDeCanto = [
    "Entrada",
    "Kyrie",
    "Gloria",
    "Aleluya",
    "Presentacion",
    "Santo",
    "Cordero de Dios",
    "Comunion",
    "Salida",
    "Otros"
];

export const CantosMisaSection = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tipoActual, setTipoActual] = useState<string>('');

    const { cantos, fetchCantosPublicos, cargando } = usePublicCantosStore();

    useEffect(() => {
        fetchCantosPublicos();
    }, []);

    if (cargando) return <p>Cargando cantos...</p>;

    const abrirModal = (tipo: string) => {
        setTipoActual(tipo);
        setModalVisible(true);
    };

    return (
        <section className="galeria w-100 p-3 text-center">
            <p className="fs-2 fw-bold">Cantos - Misa</p>
            <div className="menu-cantos d-flex flex-wrap justify-content-center">
                {tiposDeCanto.map(tipo => (
                    <div key={tipo} className="p-2">
                        <Button className="general_btn" onClick={() => abrirModal(tipo)}>
                            {tipo}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="cantos-imagen d-flex justify-content-center mt-5">
                <img className="img-fluid" src="images_members/coro-dibujo.png" alt="Dibujo coro" />
            </div>

            <CantoModal
                show={modalVisible}
                onHide={() => setModalVisible(false)}
                tipoDeCanto={tipoActual}
                cantos={cantos}
            />
        </section>
    );
};



