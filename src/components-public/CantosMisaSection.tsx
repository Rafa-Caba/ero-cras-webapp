
import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import CantoModal from "./CantoModal";
import { useCantosStore } from "../store/useCantosStore";

const tiposDeCanto = [
    "Entrada",
    "Kyrie",
    "Gloria",
    "Aleluya",
    "Presentacion de Dones",
    "Santo",
    "Cordero de Dios",
    "Comunion",
    "Salida"
];

export const CantosMisaSection = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tipoActual, setTipoActual] = useState<string>('');

    const { cantos, obtenerTodos } = useCantosStore();

    useEffect(() => {
        obtenerTodos();
    }, []);

    const abrirModal = (tipo: string) => {
        setTipoActual(tipo);
        setModalVisible(true);
    };

    return (
        <section className="galeria w-100 m-3 p-4 text-center cantos-contenedor">
            <p className="fs-2 fw-bold">Cantos - Misa</p>
            <div className="menu-cantos d-flex flex-wrap justify-content-center">
                {tiposDeCanto.map(tipo => (
                    <div key={tipo} className="p-2">
                        <Button variant="primary" onClick={() => abrirModal(tipo)}>
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



