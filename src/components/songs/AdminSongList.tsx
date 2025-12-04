import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Spinner } from 'react-bootstrap';
import { useSongStore } from '../../store/admin/useSongStore';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';
import type { Song } from '../../types';
import { capitalizeWord } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export const AdminSongList = () => {
    const { songs, loading, fetchSongs } = useSongStore();
    const { types, fetchTypes } = useSongTypeStore();
    const { canEdit } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchTypes(), fetchSongs()]);
            } catch (error) {
                console.error('Error loading songs:', error);
            }
        };
        loadData();
    }, [fetchSongs, fetchTypes]);

    const rootTypes = types
        .filter((t) => !t.parentId)
        .sort((a, b) => a.order - b.order);

    const getChildTypes = (parentId: string) =>
        types
            .filter((t) => t.parentId === parentId)
            .sort((a, b) => a.order - b.order);

    const getSongsByTypeId = (typeId: string) =>
        songs.filter((s) => s.songTypeId === typeId);

    const existingTypeIds = new Set(types.map((t) => t.id));
    const uncategorizedSongs = songs.filter(
        (s) => !s.songTypeId || !existingTypeIds.has(s.songTypeId)
    );

    const SongButtonList = ({ songList }: { songList: Song[] }) => {
        if (!songList.length) {
            return (
                <p className="text-muted small my-1">
                    No hay cantos en esta categoría.
                </p>
            );
        }

        // return (
        //     <ul className="list-group">
        //         {songList.map((song) => (
        //             <li key={song.id} className="list-group-item song-list-item">
        //                 <Link to={`/admin/song/${song.id}`}>
        //                     {song.title}
        //                 </Link>
        //             </li>
        //         ))}
        //     </ul>
        // );

        return (
            <div className="d-flex flex-wrap justify-content-center gap-2">
                {songList.map((song) => (
                    <Link
                        key={song.id}
                        to={`/admin/song/${song.id}`}
                        className="song-bar-btn half"
                    >
                        {song.title}
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="d-flex flex-column justify-content-center px-2 px-md-5 mb-0">
            <div className="d-flex flex-column align-items-center w-100 my-2">
                <p className="fw-bold m-0 fs-1">Cantos</p>
                <div className="botones mb-1">
                    {canEdit && (
                        <Link
                            to="/admin/songs/new"
                            className="btn general_btn me-2"
                        >
                            Nuevo Canto
                        </Link>
                    )}
                </div>
            </div>

            <div className="cantos-contenedor pe-0 mb-2">
                {!loading ? (
                    <Accordion alwaysOpen className="accordion-custom" id="accordionMain">
                        {rootTypes.map((root) => {
                            const childTypes = getChildTypes(root.id);
                            const rootSongs = getSongsByTypeId(root.id);

                            return (
                                <Accordion.Item eventKey={root.id} key={root.id}>
                                    <Accordion.Header>
                                        {root.isParent
                                            ? `📂 ${capitalizeWord(root.name)}`
                                            : capitalizeWord(root.name)}
                                    </Accordion.Header>

                                    <Accordion.Body
                                        className={
                                            root.isParent
                                                ? 'bg-light p-2 p-md-3'
                                                : 'p-2 p-md-3'
                                        }
                                    >
                                        {root.isParent && childTypes.length > 0 && (
                                            <Accordion
                                                alwaysOpen
                                                className="accordion-custom mb-3"
                                            >
                                                {childTypes.map((child) => {
                                                    const childSongs = getSongsByTypeId(
                                                        child.id
                                                    );

                                                    return (
                                                        <Accordion.Item
                                                            eventKey={child.id}
                                                            key={child.id}
                                                        >
                                                            <Accordion.Header>
                                                                {capitalizeWord(
                                                                    child.name
                                                                )}
                                                            </Accordion.Header>
                                                            <Accordion.Body className="p-2 p-md-3">
                                                                <SongButtonList
                                                                    songList={childSongs}
                                                                />
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    );
                                                })}
                                            </Accordion>
                                        )}

                                        {rootSongs.length > 0 && (
                                            <div
                                                className={
                                                    root.isParent
                                                        ? 'mt-3 border-top pt-2'
                                                        : ''
                                                }
                                            >
                                                {root.isParent && (
                                                    <p className="text-muted small mb-1">
                                                        Cantos directos en esta
                                                        carpeta:
                                                    </p>
                                                )}
                                                <SongButtonList songList={rootSongs} />
                                            </div>
                                        )}

                                        {root.isParent &&
                                            childTypes.length === 0 &&
                                            rootSongs.length === 0 && (
                                                <p className="text-muted text-center mb-0">
                                                    Carpeta vacía
                                                </p>
                                            )}

                                        {!root.isParent &&
                                            rootSongs.length === 0 && (
                                                <p className="text-muted small mb-0">
                                                    No hay cantos en esta categoría.
                                                </p>
                                            )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}

                        {uncategorizedSongs.length > 0 && (
                            <Accordion.Item eventKey="no-type">
                                <Accordion.Header className="text-danger">
                                    ⚠️ Sin tipo de Canto
                                </Accordion.Header>
                                <Accordion.Body className="p-2 p-md-3">
                                    <SongButtonList songList={uncategorizedSongs} />
                                </Accordion.Body>
                            </Accordion.Item>
                        )}
                    </Accordion>
                ) : (
                    <div className="cantos-contenedor text-center mt-3">
                        <Spinner animation="border" role="status" />
                    </div>
                )}
            </div>
        </div>
    );
};
