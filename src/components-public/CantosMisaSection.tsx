import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { CantoModal } from "./CantoModal";
import { usePublicCantosStore } from "../store/public/usePublicCantosStore";
import { usePublicTiposCantoStore } from "../store/public";
import type { Canto } from "../types";

export const CantosMisaSection = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCantos, setModalCantos] = useState<Canto[]>([]);
    const [tipoActual, setTipoActual] = useState<string>("");

    const { cantos, fetchCantosPublicos, cargando } = usePublicCantosStore();
    const { tipos, fetchTiposPublicos } = usePublicTiposCantoStore();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await Promise.all([fetchTiposPublicos(), fetchCantosPublicos()]);
            } catch (error) {
                console.error("Error al cargar los cantos:", error);
            }
        };
        cargarDatos();
    }, []);

    const tiposOrdenados = [...tipos].sort((a, b) => a.orden - b.orden);
    const tiposExistentes = tipos.map((t) => t.nombre);

    const cantosConTipo = tiposOrdenados.map((tipo) => ({
        tipo: tipo.nombre,
        cantos: cantos.filter((c) => c.tipo === tipo.nombre),
    }));

    const cantosSinTipo = cantos.filter((c) => !tiposExistentes.includes(c.tipo));

    const abrirModal = (tipo: string) => {
        setTipoActual(tipo);
        if (tipo !== "SinTipo") {
            const grupo = cantosConTipo.find((g) => g.tipo === tipo);
            setModalCantos(grupo ? grupo.cantos : []);
        } else {
            setModalCantos(cantosSinTipo);
        }
        setModalVisible(true);
    };

    const renderBotonesTipos = () =>
        tiposOrdenados.map(({ nombre }) => (
            <div key={nombre} className="p-2">
                <Button className="general_btn" onClick={() => abrirModal(nombre)}>
                    {nombre}
                </Button>
            </div>
        ));

    const renderBotonSinCategoria = () =>
        cantosSinTipo.length > 0 && (
            <div className="p-2">
                <Button className="general_btn" onClick={() => abrirModal("SinTipo")}>
                    Sin categoría
                </Button>
            </div>
        );

    if (cargando) return <p>Cargando cantos...</p>;

    return (
        <section className="primary-color-container w-100 p-3 text-center">
            <p className="fs-2 fw-bold">Cantos - Misa</p>

            <div className="menu-cantos d-flex flex-wrap justify-content-center">
                {renderBotonesTipos()}
                {renderBotonSinCategoria()}
            </div>

            <div className="cantos-imagen d-flex justify-content-center mt-5">
                <img
                    className="img-fluid"
                    src="images_members/coro-dibujo.png"
                    alt="Dibujo coro"
                />
            </div>

            <CantoModal
                show={modalVisible}
                onHide={() => setModalVisible(false)}
                tipoDeCanto={tipoActual}
                cantos={modalCantos}
            />
        </section>
    );
};