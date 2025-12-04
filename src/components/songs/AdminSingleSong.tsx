import { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { TiptapViewer } from "../tiptap-components/TiptapViewer";
import { useSongStore } from "../../store/admin/useSongStore";
import type { Song } from "../../types";
import { parseText } from "../../utils/handleTextTipTap";
import { useAuth } from "../../context/AuthContext";

export const AdminSingleSong = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { canEdit } = useAuth();

    const { getSong, removeSong } = useSongStore();
    const [song, setSong] = useState<Song | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchSong = async () => {
            if (id) {
                const data = await getSong(id);
                setSong(data);
            }
        };
        fetchSong();
    }, [id, getSong]);

    if (!song) {
        return <p className="text-center mt-5">Cargando canto...</p>;
    }

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción no se puede deshacer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed && song.id) {
            try {
                await removeSong(song.id);
                Swal.fire("¡Borrado!", "El canto ha sido eliminado.", "success");
                navigate("/admin/songs");
            } catch (err) {
                Swal.fire("Error", "No se pudo eliminar el canto", "error");
            }
        }
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    return (
        <div className="canto p-3 w-100 text-center my-3">
            <div>
                <h2 className="titulo">{song.title}</h2>
                <p className="fst-italic">{song.songTypeName}</p>

                {song.audioUrl && (
                    <div className="d-flex justify-content-center mt-3 mb-4">
                        <button
                            type="button"
                            className="audio-bar-btn"
                            onClick={handlePlayPause}
                        >
                            <span className="audio-bar-icon">▶</span>
                            <div className="text-start">
                                <div className="fw-bold">Escuchar audio</div>
                                <div className="small text-muted">
                                    Toca para reproducir / pausar
                                </div>
                            </div>
                        </button>
                        <audio ref={audioRef} src={song.audioUrl} />
                    </div>
                )}

                <div className="texto-scrollable my-2">
                    <div className="d-md-block text-center mb-3 fs-4">
                        <TiptapViewer content={parseText(song.content)} />
                    </div>
                </div>

                <p className="fst-italic mb-4 fw-bold">{song.composer}</p>

                <div className="m-0">
                    {canEdit && (
                        <>
                            <Button
                                variant="danger"
                                className="px-3"
                                onClick={handleDelete}
                                style={{ borderRadius: 10 }}
                            >
                                🗑️ Borrar
                            </Button>
                            <Link
                                to={`/admin/songs/edit/${song.id}`}
                                className="btn general_btn ms-2"
                            >
                                ✏️ Editar
                            </Link>
                        </>
                    )}

                    <Link
                        to="/admin/songs"
                        className="btn general_btn ms-2 mt-2 mt-md-0"
                    >
                        🔙 Regresar
                    </Link>
                </div>
            </div>
        </div>
    );
};
