import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { FaFolder, FaMusic, FaArrowLeft } from "react-icons/fa";
import { SongModal } from "./SongModal";
import { useSongStore, useSongTypeStore } from "../../store/public";
import type { Song, SongType } from "../../types/song";

const sortSongTypes = (a: SongType, b: SongType) => {
    const orderA = typeof a.order === 'number' ? a.order : 99;
    const orderB = typeof b.order === 'number' ? b.order : 99;

    if (orderA !== orderB) return orderA - orderB;

    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
};

export const SongsSection = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSongs, setModalSongs] = useState<Song[]>([]);
    const [currentCategoryName, setCurrentCategoryName] = useState<string>("");

    const [currentParent, setCurrentParent] = useState<SongType | null>(null);

    const { songs, fetchSongs, loading } = useSongStore();
    const { types, fetchTypes } = useSongTypeStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchTypes(), fetchSongs()]);
            } catch (error) {
                console.error("Error loading songs data:", error);
            }
        };
        loadData();
    }, []);

    const sortedTypes = [...types].sort(sortSongTypes);

    const visibleTypes = currentParent
        ? sortedTypes.filter(t => t.parentId === currentParent.id)
        : sortedTypes.filter(t => !t.parentId);

    const handleTypeClick = (type: SongType) => {
        if (type.isParent) {
            setCurrentParent(type);
        } else {
            openModal(type);
        }
    };

    const handleBack = () => {
        setCurrentParent(null);
    };

    const openModal = (typeOrSpecial: SongType | "SinTipo") => {
        if (typeOrSpecial === "SinTipo") {
            setCurrentCategoryName("Sin categoría");


            const existingTypeIds = types.map((t) => t.id);
            const uncategorized = songs.filter(
                (s) => !s.songTypeId || !existingTypeIds.includes(s.songTypeId)
            );

            setModalSongs(uncategorized);
            setModalVisible(true);
            return;
        }

        const type = typeOrSpecial;
        setCurrentCategoryName(type.name);

        const matchingSongs = songs.filter((s) => s.songTypeId === type.id);
        setModalSongs(matchingSongs);
        setModalVisible(true);
    };

    const renderUncategorizedButton = () => {
        if (currentParent) return null;

        const existingTypeIds = types.map((t) => t.id);
        const hasUncategorized = songs.some(
            (s) => !s.songTypeId || !existingTypeIds.includes(s.songTypeId)
        );

        if (!hasUncategorized) return null;

        return (
            <div className="p-2">
                <Button
                    className="general_btn"
                    onClick={() => openModal("SinTipo")}
                >
                    Sin categoría
                </Button>
            </div>
        );
    };

    if (loading) return <p className="text-center my-5">Cargando cantos...</p>;

    return (
        <section className="primary-color-container w-100 p-3 text-center">

            <div className="d-flex align-items-center justify-content-center position-relative mb-3">
                {currentParent && (
                    <>
                        <Button
                            variant="link"
                            className="d-none d-md-block position-absolute start-0 text-decoration-none fw-bold text-theme-color"
                            onClick={handleBack}
                        >
                            <FaArrowLeft /> Volver
                        </Button>
                        <Button
                            variant="link"
                            className="d-block d-md-none position-absolute start-0 text-decoration-none fw-bold text-theme-color"
                            onClick={handleBack}
                        >
                            <FaArrowLeft />
                        </Button>
                    </>
                )}

                <p className="fs-2 fw-bold m-0">
                    {currentParent ? `📂 ${currentParent.name}` : "Cantos - Misa"}
                </p>
            </div>

            <div
                className="menu-cantos d-flex flex-wrap justify-content-center"
                style={{ minHeight: '150px' }}
            >
                {visibleTypes.length === 0 && currentParent && (
                    <p className="text-muted mt-4">Carpeta vacía.</p>
                )}

                {visibleTypes.map((type) => (
                    <div key={type.id} className="p-2">
                        <Button
                            className={`general_btn d-flex align-items-center gap-2 ${type.isParent ? 'px-4' : ''}`}
                            onClick={() => handleTypeClick(type)}
                            style={type.isParent ? { border: '2px solid var(--color-accent)' } : {}}
                        >
                            {type.isParent ? <FaFolder className="text-warning" /> : <FaMusic />}
                            {type.name}
                        </Button>
                    </div>
                ))}

                {renderUncategorizedButton()}
            </div>

            <div className="cantos-imagen d-flex justify-content-center mt-5">
                <img
                    className="img-fluid"
                    src="images_members/coro-dibujo.png"
                    alt="Dibujo coro"
                />
            </div>

            <SongModal
                show={modalVisible}
                onHide={() => setModalVisible(false)}
                categoryName={currentCategoryName}
                songs={modalSongs}
            />
        </section>
    );
};
